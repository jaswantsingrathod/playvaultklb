const express = require('express');
const router = express.Router();
const {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
} = require('../controllers/settingController');
const { protectAdmin } = require('../middleware/auth');

// Public route / or admin when routed through /api/admin/settings
router.get('/', (req, res, next) => {
  if (req.baseUrl.includes('/admin')) {
    return protectAdmin(req, res, () => getAdminSettings(req, res, next));
  }
  return getPublicSettings(req, res, next);
});

// Admin routes with /admin prefix
router.get('/admin', protectAdmin, getAdminSettings);
router.put('/admin', protectAdmin, updateSettings);

// Admin routes without /admin prefix
router.put('/', protectAdmin, updateSettings);

module.exports = router;
