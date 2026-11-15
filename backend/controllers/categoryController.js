const GameCategory = require('../models/GameCategory');
const Game = require('../models/Game');
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

// @desc    Get all public categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await GameCategory.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories for admin (including inactive and game count with server-side pagination & search)
// @route   GET /api/admin/categories
// @access  Private
const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await GameCategory.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const categories = await GameCategory.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    // Count games per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const gameCount = await Game.countDocuments({
          category: cat._id,
          isDeleted: false,
        });
        return {
          ...cat.toObject(),
          gameCount,
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
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, displayOrder, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    const existingSlug = await GameCategory.findOne({ slug: finalSlug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists.',
      });
    }

    const category = await GameCategory.create({
      name: name.trim(),
      slug: finalSlug,
      description: description || '',
      icon: icon || 'Gamepad2',
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await logActivity(req, 'CREATE_CATEGORY', 'Categories', `Created category: ${category.name}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, displayOrder, isActive } = req.body;

    const category = await GameCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (name) category.name = name.trim();
    if (slug) category.slug = slugify(slug);
    if (description !== undefined) category.description = description.trim();
    if (icon) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    await logActivity(req, 'UPDATE_CATEGORY', 'Categories', `Updated category: ${category.name}`);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await GameCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Check if games are associated
    const associatedGames = await Game.countDocuments({
      category: id,
      isDeleted: false,
    });

    if (associatedGames > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because ${associatedGames} games are assigned to it. Reassign or remove games first.`,
      });
    }

    await GameCategory.findByIdAndDelete(id);

    await logActivity(req, 'DELETE_CATEGORY', 'Categories', `Deleted category: ${category.name}`);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete categories
// @route   POST /api/admin/categories/bulk-delete
// @access  Private
const bulkDeleteCategories = async (req, res, next) => {
  try {
    const { ids, force = false } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of category IDs to delete.',
      });
    }

    // Check if any games are attached to these categories
    const gamesCount = await Game.countDocuments({
      category: { $in: ids },
      isDeleted: false,
    });

    if (gamesCount > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete selected categories because ${gamesCount} active games are assigned to them. Reassign or remove those games first.`,
      });
    }

    const deleteResult = await GameCategory.deleteMany({ _id: { $in: ids } });

    await logActivity(
      req,
      'BULK_DELETE_CATEGORIES',
      'Categories',
      `Bulk deleted ${deleteResult.deletedCount || ids.length} categories.`
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount || ids.length} categories.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
};
