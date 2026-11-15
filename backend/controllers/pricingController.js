const GamePricing = require('../models/GamePricing');
const Game = require('../models/Game');
const { logActivity } = require('../middleware/activityLogger');

// @desc    Get pricing tiers for a specific game
// @route   GET /api/pricing/game/:gameId
// @access  Public
const getPricingByGame = async (req, res, next) => {
  try {
    const { gameId } = req.params;

    const pricing = await GamePricing.find({
      game: gameId,
      isActive: true,
    }).sort({ durationHours: 1, displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: pricing.length,
      data: pricing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pricing for admin (all games or filtered by game with pagination & search)
// @route   GET /api/admin/pricing
// @access  Private
const getAdminPricing = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, gameId, pricingType, status } = req.query;

    const query = {};
    if (gameId && gameId !== 'all') query.game = gameId;
    if (pricingType && pricingType !== 'all') query.pricingType = pricingType;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { badge: searchRegex }, { description: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await GamePricing.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const pricing = await GamePricing.find(query)
      .populate('game', 'title slug coverImage hourlyPrice dailyPrice isAvailable')
      .sort({ game: 1, durationHours: 1, displayOrder: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      pages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      count: pricing.length,
      data: pricing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing tier for a game
// @route   POST /api/admin/pricing
// @access  Private
const createPricingTier = async (req, res, next) => {
  try {
    const {
      game,
      durationHours,
      title,
      price,
      originalPrice,
      pricingType,
      description,
      badge,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    if (!game || !durationHours || !title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Game ID, Duration (in hours), Title, and Price.',
      });
    }

    const gameDoc = await Game.findById(game);
    if (!gameDoc) {
      return res.status(404).json({
        success: false,
        message: 'Associated game not found.',
      });
    }

    const tier = await GamePricing.create({
      game,
      durationHours: Number(durationHours),
      title: title.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      pricingType: pricingType || 'hourly',
      description: description ? description.trim() : '',
      badge: badge ? badge.trim() : '',
      isPopular: isPopular !== undefined ? isPopular : false,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    await logActivity(
      req,
      'CREATE_PRICING',
      'Pricing',
      `Added pricing tier for ${gameDoc.title}: ${tier.title} - ₹${tier.price}`
    );

    res.status(201).json({
      success: true,
      message: 'Pricing tier created successfully.',
      data: tier,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pricing tier
// @route   PUT /api/admin/pricing/:id
// @access  Private
const updatePricingTier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tier = await GamePricing.findById(id).populate('game', 'title');

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Pricing tier not found.',
      });
    }

    const {
      durationHours,
      title,
      price,
      originalPrice,
      pricingType,
      description,
      badge,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    if (durationHours !== undefined) tier.durationHours = Number(durationHours);
    if (title) tier.title = title.trim();
    if (price !== undefined) tier.price = Number(price);
    if (originalPrice !== undefined) tier.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (pricingType) tier.pricingType = pricingType;
    if (description !== undefined) tier.description = description.trim();
    if (badge !== undefined) tier.badge = badge.trim();
    if (isPopular !== undefined) tier.isPopular = isPopular;
    if (isActive !== undefined) tier.isActive = isActive;
    if (displayOrder !== undefined) tier.displayOrder = Number(displayOrder);

    await tier.save();

    await logActivity(
      req,
      'UPDATE_PRICING',
      'Pricing',
      `Updated pricing tier for ${tier.game?.title || 'game'}: ${tier.title} - ₹${tier.price} (Active: ${tier.isActive})`
    );

    res.status(200).json({
      success: true,
      message: 'Pricing tier updated successfully.',
      data: tier,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pricing tier
// @route   DELETE /api/admin/pricing/:id
// @access  Private
const deletePricingTier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tier = await GamePricing.findById(id).populate('game', 'title');

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Pricing tier not found.',
      });
    }

    await GamePricing.findByIdAndDelete(id);

    await logActivity(
      req,
      'DELETE_PRICING',
      'Pricing',
      `Deleted pricing tier: ${tier.title} for ${tier.game?.title || 'game'}`
    );

    res.status(200).json({
      success: true,
      message: 'Pricing tier deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete pricing tiers
// @route   POST /api/admin/pricing/bulk-delete
// @access  Private
const bulkDeletePricingTiers = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of pricing tier IDs to delete.',
      });
    }

    const deleteResult = await GamePricing.deleteMany({ _id: { $in: ids } });

    await logActivity(
      req,
      'BULK_DELETE_PRICING',
      'Pricing',
      `Bulk deleted ${deleteResult.deletedCount || ids.length} pricing tiers.`
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount || ids.length} pricing tiers.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricingByGame,
  getAdminPricing,
  createPricingTier,
  updatePricingTier,
  deletePricingTier,
  bulkDeletePricingTiers,
};
