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
      Game.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select('title coverImage isAvailable isActive genre platform'),
      GamePricing.countDocuments({ isActive: true }),
    ]);

    // Average daily price
    const gamesPrices = await Game.find({ isDeleted: false, isActive: true }).select('dailyPrice');
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

// @desc    Get full activity logs with pagination and search
// @route   GET /api/admin/dashboard/logs
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, module, search } = req.query;

    const query = {};
    if (module && module !== 'all') query.module = module;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ action: searchRegex }, { details: searchRegex }, { ipAddress: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await AdminActivityLog.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const logs = await AdminActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('admin', 'username fullName email');

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      pages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete activity logs
// @route   POST /api/admin/dashboard/logs/bulk-delete
// @access  Private
const bulkDeleteActivityLogs = async (req, res, next) => {
  try {
    const { ids, all = false, module } = req.body;

    let deleteResult;
    if (all === true || all === 'true') {
      const query = {};
      if (module && module !== 'all') query.module = module;
      deleteResult = await AdminActivityLog.deleteMany(query);
    } else {
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of activity log IDs to delete.',
        });
      }
      deleteResult = await AdminActivityLog.deleteMany({ _id: { $in: ids } });
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} log entries.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivityLogs,
  bulkDeleteActivityLogs,
};
