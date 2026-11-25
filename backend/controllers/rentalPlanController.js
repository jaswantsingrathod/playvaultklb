const RentalPlan = require('../models/RentalPlan');
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

// @desc    Get all active rental plans for public
// @route   GET /api/rental-plans
// @access  Public
const getPublicRentalPlans = async (req, res, next) => {
  try {
    const plans = await RentalPlan.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rental plans for admin (with pagination, search, status filter)
// @route   GET /api/admin/rental-plans
// @access  Private
const getAdminRentalPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { durationLabel: searchRegex }, { badge: searchRegex }, { description: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await RentalPlan.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const plans = await RentalPlan.find(query)
      .sort({
        displayOrder: 1,
        createdAt: 1,
      })
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
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a rental plan
// @route   POST /api/admin/rental-plans
// @access  Private
const createRentalPlan = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      durationLabel,
      durationHours,
      price,
      originalPrice,
      description,
      inclusions,
      badge,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    if (!name || !durationLabel || !durationHours || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Plan Name, Duration Label, Duration Hours, and Price.',
      });
    }

    let finalSlug = slug ? slugify(slug) : slugify(name);
    const existingSlug = await RentalPlan.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    let inclusionsList = inclusions;
    if (typeof inclusions === 'string') {
      inclusionsList = inclusions.split('\n').map((i) => i.trim()).filter(Boolean);
    }

    const plan = await RentalPlan.create({
      name: name.trim(),
      slug: finalSlug,
      durationLabel: durationLabel.trim(),
      durationHours: Number(durationHours),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      description: description || '',
      inclusions: inclusionsList || [
        'PS5 Console (Disk/Digital)',
        '1 DualSense Wireless Controller',
        '24/7 Dedicated Support',
        'GTA VI / Top AAA Games Included',
      ],
      badge: badge ? badge.trim() : '',
      isPopular: isPopular !== undefined ? isPopular : false,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    await logActivity(req, 'CREATE_PLAN', 'RentalPlans', `Created rental plan: ${plan.name} (₹${plan.price})`);

    res.status(201).json({
      success: true,
      message: 'Rental plan created successfully.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a rental plan
// @route   PUT /api/admin/rental-plans/:id
// @access  Private
const updateRentalPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await RentalPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Rental plan not found.',
      });
    }

    const {
      name,
      slug,
      durationLabel,
      durationHours,
      price,
      originalPrice,
      description,
      inclusions,
      badge,
      isPopular,
      isActive,
      displayOrder,
    } = req.body;

    if (name) plan.name = name.trim();
    if (slug) plan.slug = slugify(slug);
    if (durationLabel) plan.durationLabel = durationLabel.trim();
    if (durationHours !== undefined) plan.durationHours = Number(durationHours);
    if (price !== undefined) plan.price = Number(price);
    if (originalPrice !== undefined) plan.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (description !== undefined) plan.description = description.trim();
    if (inclusions !== undefined) {
      if (typeof inclusions === 'string') {
        plan.inclusions = inclusions.split('\n').map((i) => i.trim()).filter(Boolean);
      } else if (Array.isArray(inclusions)) {
        plan.inclusions = inclusions;
      }
    }
    if (badge !== undefined) plan.badge = badge.trim();
    if (isPopular !== undefined) plan.isPopular = isPopular;
    if (isActive !== undefined) plan.isActive = isActive;
    if (displayOrder !== undefined) plan.displayOrder = Number(displayOrder);

    await plan.save();

    await logActivity(req, 'UPDATE_PLAN', 'RentalPlans', `Updated rental plan: ${plan.name} (₹${plan.price})`);

    res.status(200).json({
      success: true,
      message: 'Rental plan updated successfully.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a rental plan
// @route   DELETE /api/admin/rental-plans/:id
// @access  Private
const deleteRentalPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await RentalPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Rental plan not found.',
      });
    }

    await RentalPlan.findByIdAndDelete(id);

    await logActivity(req, 'DELETE_PLAN', 'RentalPlans', `Deleted rental plan: ${plan.name}`);

    res.status(200).json({
      success: true,
      message: 'Rental plan deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete rental plans
// @route   POST /api/admin/rental-plans/bulk-delete
// @access  Private
const bulkDeleteRentalPlans = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of rental plan IDs to delete.',
      });
    }

    const deleteResult = await RentalPlan.deleteMany({ _id: { $in: ids } });

    await logActivity(
      req,
      'BULK_DELETE_PLANS',
      'RentalPlans',
      `Bulk deleted ${deleteResult.deletedCount || ids.length} rental plans.`
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount || ids.length} rental plans.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder rental plans (batch update displayOrder)
// @route   PUT /api/admin/rental-plans/reorder
// @access  Private
const reorderRentalPlans = async (req, res, next) => {
  try {
    const { planIds } = req.body;

    if (!Array.isArray(planIds) || planIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an ordered array of rental plan IDs.',
      });
    }

    const bulkOps = planIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index + 1 } },
      },
    }));

    await RentalPlan.bulkWrite(bulkOps);

    await logActivity(
      req,
      'REORDER_PLANS',
      'RentalPlans',
      `Reordered ${planIds.length} rental plans.`
    );

    res.status(200).json({
      success: true,
      message: 'Rental plans reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicRentalPlans,
  getAdminRentalPlans,
  createRentalPlan,
  updateRentalPlan,
  deleteRentalPlan,
  bulkDeleteRentalPlans,
  reorderRentalPlans,
};
