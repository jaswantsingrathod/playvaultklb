const Game = require('../models/Game');
const GameCategory = require('../models/GameCategory');
const RentalPlan = require('../models/RentalPlan');
const GamePricing = require('../models/GamePricing');
const Media = require('../models/Media');
const AdminActivityLog = require('../models/AdminActivityLog');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalGames,
      activeGames,
      inactiveGames,
      availableGames,
      rentedGames,
      featuredGames,
      totalPlans,
      activePlans,
      totalCategories,
      totalMedia,
      recentActivities,
      latestGames,
      pricingsCount,
    ] = await Promise.all([
      Game.countDocuments({ isDeleted: false }),
      Game.countDocuments({ isDeleted: false, isActive: true }),
      Game.countDocuments({ isDeleted: false, isActive: false }),
      Game.countDocuments({ isDeleted: false, isActive: true, isAvailable: true }),
      Game.countDocuments({ isDeleted: false, isActive: true, isAvailable: false }),
      Game.countDocuments({ isDeleted: false, isFeatured: true }),
      RentalPlan.countDocuments(),
      RentalPlan.countDocuments({ isActive: true }),
      GameCategory.countDocuments(),
      Media.countDocuments(),
      AdminActivityLog.find().sort({ createdAt: -1 }).limit(10),
      Game.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select('title coverImage hourlyPrice dailyPrice isAvailable isActive genre'),
      GamePricing.countDocuments({ isActive: true }),
    ]);

    // Average hourly and daily price
    const gamesPrices = await Game.find({ isDeleted: false, isActive: true }).select('hourlyPrice dailyPrice');
    const avgHourly = gamesPrices.length
      ? Math.round(gamesPrices.reduce((acc, g) => acc + (g.hourlyPrice || 0), 0) / gamesPrices.length)
      : 0;
    const avgDaily = gamesPrices.length
      ? Math.round(gamesPrices.reduce((acc, g) => acc + (g.dailyPrice || 0), 0) / gamesPrices.length)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalGames,
        activeGames,
        inactiveGames,
        availableGames,
        rentedGames,
        featuredGames,
        totalPlans,
        activePlans,
        totalCategories,
        totalMedia,
        activePricings: pricingsCount,
        avgHourlyPrice: avgHourly,
        avgDailyPrice: avgDaily,
      },
      latestGames,
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full activity logs with pagination
// @route   GET /api/admin/dashboard/logs
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, module } = req.query;

    const query = {};
    if (module && module !== 'all') query.module = module;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AdminActivityLog.countDocuments(query);

    const logs = await AdminActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('admin', 'username fullName email');

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivityLogs,
};
