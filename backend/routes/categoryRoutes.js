const express = require('express');
const router = express.Router();
const {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/auth');

// Public route
router.get('/', (req, res, next) => {
  // If requesting from admin panel route /api/admin/categories
  if (req.baseUrl.includes('/admin')) {
    return protectAdmin(req, res, () => getAllCategoriesAdmin(req, res, next));
  }
  return getCategories(req, res, next);
});

// Admin routes with /admin prefix
router.get('/admin', protectAdmin, getAllCategoriesAdmin);
router.post('/admin/bulk-delete', protectAdmin, bulkDeleteCategories);
router.delete('/admin/bulk', protectAdmin, bulkDeleteCategories);
router.post('/admin', protectAdmin, createCategory);
router.put('/admin/:id', protectAdmin, updateCategory);
router.delete('/admin/:id', protectAdmin, deleteCategory);

// Admin routes without /admin prefix (when mounted at /api/admin/categories)
router.post('/bulk-delete', protectAdmin, bulkDeleteCategories);
router.delete('/bulk', protectAdmin, bulkDeleteCategories);
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;
