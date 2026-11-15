const Game = require('../models/Game');
const GameCategory = require('../models/GameCategory');
const GamePricing = require('../models/GamePricing');
const { logActivity } = require('../middleware/activityLogger');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all public games with filters & active pricing
// @route   GET /api/games
// @access  Public
const getPublicGames = async (req, res, next) => {
  try {
    const { category, genre, search, featured, sort } = req.query;

    const query = {
      isActive: true,
      isDeleted: false,
    };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (genre && genre !== 'All Games' && genre !== 'all') {
      query.$or = [
        { genre: new RegExp(genre, 'i') },
        { tags: { $in: [new RegExp(genre, 'i')] } },
      ];
    }

    if (category && category !== 'all') {
      // Can be category id or slug
      const foundCategory = await GameCategory.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { genre: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    let sortOption = { displayOrder: 1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { hourlyPrice: 1 };
    if (sort === 'price_desc') sortOption = { hourlyPrice: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const games = await Game.find(query)
      .populate('category', 'name slug icon')
      .sort(sortOption)
      .lean();

    // Attach active pricing options for each game
    const gamesWithPricing = await Promise.all(
      games.map(async (game) => {
        const pricing = await GamePricing.find({
          game: game._id,
          isActive: true,
        }).sort({ durationHours: 1, displayOrder: 1 });
        return {
          ...game,
          pricingTiers: pricing,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: gamesWithPricing.length,
      data: gamesWithPricing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single game for public
// @route   GET /api/games/:id
// @access  Public
const getPublicGameById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = {
      isActive: true,
      isDeleted: false,
      $or: [{ slug: id }],
    };

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: id });
    }

    const game = await Game.findOne(query).populate('category', 'name slug icon');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found or currently unavailable.',
      });
    }

    const pricingTiers = await GamePricing.find({
      game: game._id,
      isActive: true,
    }).sort({ durationHours: 1, displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...game.toObject(),
        pricingTiers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all games for Admin (with search, pagination, status & category filters)
// @route   GET /api/admin/games
// @access  Private
const getAdminGames = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { isDeleted: false };

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'available') {
      query.isActive = true;
      query.isAvailable = true;
    }
    if (status === 'rented') {
      query.isAvailable = false;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { genre: searchRegex }, { tags: { $in: [searchRegex] } }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Game.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    let sort = { createdAt: -1 };
    if (sortBy === 'title') sort = { title: sortOrder === 'asc' ? 1 : -1 };
    if (sortBy === 'hourlyPrice') sort = { hourlyPrice: sortOrder === 'asc' ? 1 : -1 };
    if (sortBy === 'rating') sort = { rating: sortOrder === 'asc' ? 1 : -1 };
    if (sortBy === 'displayOrder') sort = { displayOrder: 1, createdAt: -1 };

    const games = await Game.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach pricing count
    const enrichedGames = await Promise.all(
      games.map(async (g) => {
        const pricingCount = await GamePricing.countDocuments({ game: g._id });
        return {
          ...g,
          pricingCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      pages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      count: enrichedGames.length,
      data: enrichedGames,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single game for Admin (with all pricing tiers)
// @route   GET /api/admin/games/:id
// @access  Private
const getAdminGameById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id).populate('category');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found.',
      });
    }

    const pricingTiers = await GamePricing.find({ game: game._id }).sort({
      durationHours: 1,
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: {
        ...game.toObject(),
        pricingTiers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new game
// @route   POST /api/admin/games
// @access  Private
const createGame = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      coverImage,
      bannerImage,
      genre,
      category,
      platform,
      hourlyPrice,
      dailyPrice,
      specialPrice,
      isAvailable,
      isFeatured,
      isActive,
      rating,
      releaseYear,
      tags,
      players,
      storageRequired,
      displayOrder,
      defaultPricingTiers,
    } = req.body;

    if (!title || !coverImage || !genre || hourlyPrice === undefined || dailyPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Cover Image, Genre, Hourly Price, and Daily Price.',
      });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);

    // Ensure slug uniqueness
    const slugExists = await Game.findOne({ slug: finalSlug, isDeleted: false });
    if (slugExists) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const game = await Game.create({
      title: title.trim(),
      slug: finalSlug,
      description: description || '',
      coverImage: coverImage.trim(),
      bannerImage: bannerImage ? bannerImage.trim() : '',
      genre: genre.trim(),
      category: category || null,
      platform: platform || 'PS5',
      hourlyPrice: Number(hourlyPrice),
      dailyPrice: Number(dailyPrice),
      specialPrice: specialPrice ? Number(specialPrice) : null,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isActive: isActive !== undefined ? isActive : true,
      rating: rating ? Number(rating) : 4.8,
      releaseYear: releaseYear ? Number(releaseYear) : 2024,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      players: players || '1-2 Players',
      storageRequired: storageRequired || '75 GB',
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    // Auto-create default tiered pricing if provided or generate standard tiers (1h, 2h, 3h, 5h)
    const baseHourly = Number(hourlyPrice);
    const standardTiers = defaultPricingTiers || [
      {
        durationHours: 1,
        title: '1 Hour Quick Play',
        price: baseHourly,
        pricingType: 'hourly',
        description: 'Single hour gaming session',
        isActive: true,
        displayOrder: 1,
      },
      {
        durationHours: 2,
        title: '2 Hours Duo Pass',
        price: Math.round(baseHourly * 1.8),
        originalPrice: baseHourly * 2,
        pricingType: 'multi-hour',
        badge: 'Popular',
        isPopular: true,
        description: 'Two hours non-stop action',
        isActive: true,
        displayOrder: 2,
      },
      {
        durationHours: 3,
        title: '3 Hours Squad Session',
        price: Math.round(baseHourly * 2.6),
        originalPrice: baseHourly * 3,
        pricingType: 'multi-hour',
        badge: 'Save 15%',
        description: 'Great for co-op & multiplayer',
        isActive: true,
        displayOrder: 3,
      },
      {
        durationHours: 5,
        title: '5 Hours Pro Gaming',
        price: Math.round(baseHourly * 4.0),
        originalPrice: baseHourly * 5,
        pricingType: 'package',
        badge: 'Best Value',
        description: 'Extended gaming session',
        isActive: true,
        displayOrder: 4,
      },
    ];

    await Promise.all(
      standardTiers.map((tier) =>
        GamePricing.create({
          game: game._id,
          ...tier,
        })
      )
    );

    await logActivity(req, 'CREATE_GAME', 'Games', `Created game: ${game.title} (Hourly: ₹${game.hourlyPrice})`);

    res.status(201).json({
      success: true,
      message: 'Game created successfully with pricing tiers.',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a game
// @route   PUT /api/admin/games/:id
// @access  Private
const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found.',
      });
    }

    const {
      title,
      slug,
      description,
      coverImage,
      bannerImage,
      genre,
      category,
      platform,
      hourlyPrice,
      dailyPrice,
      specialPrice,
      isAvailable,
      isFeatured,
      isActive,
      rating,
      releaseYear,
      tags,
      players,
      storageRequired,
      displayOrder,
    } = req.body;

    if (title) game.title = title.trim();
    if (slug) game.slug = slugify(slug);
    if (description !== undefined) game.description = description.trim();
    if (coverImage) game.coverImage = coverImage.trim();
    if (bannerImage !== undefined) game.bannerImage = bannerImage.trim();
    if (genre) game.genre = genre.trim();
    if (category !== undefined) game.category = category || null;
    if (platform) game.platform = platform.trim();
    if (hourlyPrice !== undefined) game.hourlyPrice = Number(hourlyPrice);
    if (dailyPrice !== undefined) game.dailyPrice = Number(dailyPrice);
    if (specialPrice !== undefined) game.specialPrice = specialPrice ? Number(specialPrice) : null;
    if (isAvailable !== undefined) game.isAvailable = isAvailable;
    if (isFeatured !== undefined) game.isFeatured = isFeatured;
    if (isActive !== undefined) game.isActive = isActive;
    if (rating !== undefined) game.rating = Number(rating);
    if (releaseYear !== undefined) game.releaseYear = Number(releaseYear);
    if (tags !== undefined) {
      game.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }
    if (players !== undefined) game.players = players.trim();
    if (storageRequired !== undefined) game.storageRequired = storageRequired.trim();
    if (displayOrder !== undefined) game.displayOrder = Number(displayOrder);

    await game.save();

    await logActivity(
      req,
      'UPDATE_GAME',
      'Games',
      `Updated game: ${game.title} (Available: ${game.isAvailable}, Active: ${game.isActive})`
    );

    res.status(200).json({
      success: true,
      message: 'Game updated successfully.',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a game (Soft delete)
// @route   DELETE /api/admin/games/:id
// @access  Private
const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found.',
      });
    }

    if (permanent === 'true') {
      await Game.findByIdAndDelete(id);
      await GamePricing.deleteMany({ game: id });
      await logActivity(req, 'PERMANENT_DELETE_GAME', 'Games', `Permanently deleted game: ${game.title}`);
    } else {
      game.isDeleted = true;
      game.isActive = false;
      await game.save();
      await logActivity(req, 'SOFT_DELETE_GAME', 'Games', `Soft deleted game: ${game.title}`);
    }

    res.status(200).json({
      success: true,
      message: permanent === 'true' ? 'Game permanently deleted.' : 'Game archived/removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete or archive games
// @route   POST /api/admin/games/bulk-delete
// @access  Private
const bulkDeleteGames = async (req, res, next) => {
  try {
    const { ids, permanent = false } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of game IDs to delete.',
      });
    }

    if (permanent === true || permanent === 'true') {
      const deleteResult = await Game.deleteMany({ _id: { $in: ids } });
      await GamePricing.deleteMany({ game: { $in: ids } });

      await logActivity(
        req,
        'BULK_PERMANENT_DELETE_GAMES',
        'Games',
        `Permanently deleted ${deleteResult.deletedCount || ids.length} games and their pricing engine tiers.`
      );

      return res.status(200).json({
        success: true,
        message: `Permanently deleted ${deleteResult.deletedCount || ids.length} games successfully.`,
        deletedCount: deleteResult.deletedCount,
      });
    } else {
      const updateResult = await Game.updateMany(
        { _id: { $in: ids } },
        { $set: { isDeleted: true, isActive: false } }
      );

      await logActivity(
        req,
        'BULK_SOFT_DELETE_GAMES',
        'Games',
        `Archived/soft-deleted ${updateResult.modifiedCount || ids.length} games.`
      );

      return res.status(200).json({
        success: true,
        message: `Successfully moved ${updateResult.modifiedCount || ids.length} games to archive.`,
        archivedCount: updateResult.modifiedCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicGames,
  getPublicGameById,
  getAdminGames,
  getAdminGameById,
  createGame,
  updateGame,
  deleteGame,
  bulkDeleteGames,
};
