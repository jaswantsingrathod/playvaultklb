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

// @desc    Get all pricing for admin (all games or filtered by game)
// @route   GET /api/admin/pricing
// @access  Private
const getAdminPricing = async (req, res, next) => {
  try {
    const { gameId, pricingType } = req.query;

    const query = {};
    if (gameId) query.game = gameId;
    if (pricingType) query.pricingType = pricingType;

    const pricing = await GamePricing.find(query)
      .populate('game', 'title slug coverImage hourlyPrice dailyPrice isAvailable')
      .sort({ game: 1, durationHours: 1, displayOrder: 1 });

    res.status(200).json({
      success: true,
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

module.exports = {
  getPricingByGame,
  getAdminPricing,
  createPricingTier,
  updatePricingTier,
  deletePricingTier,
};
