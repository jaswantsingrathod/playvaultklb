const express = require('express');
const router = express.Router();
const {
  getPricingByGame,
  getAdminPricing,
  createPricingTier,
  updatePricingTier,
  deletePricingTier,
  bulkDeletePricingTiers,
} = require('../controllers/pricingController');
const { protectAdmin } = require('../middleware/auth');

// Public route
router.get('/game/:gameId', getPricingByGame);

// Route for /
router.get('/', (req, res, next) => {
  if (req.baseUrl.includes('/admin') || req.headers.authorization) {
    return protectAdmin(req, res, () => getAdminPricing(req, res, next));
  }
  return res.status(400).json({ success: false, message: 'Please specify game ID or provide admin token' });
});

// Admin routes with /admin prefix
router.get('/admin', protectAdmin, getAdminPricing);
router.post('/admin/bulk-delete', protectAdmin, bulkDeletePricingTiers);
router.delete('/admin/bulk', protectAdmin, bulkDeletePricingTiers);
router.post('/admin', protectAdmin, createPricingTier);
router.put('/admin/:id', protectAdmin, updatePricingTier);
router.delete('/admin/:id', protectAdmin, deletePricingTier);

// Admin routes without /admin prefix
router.post('/bulk-delete', protectAdmin, bulkDeletePricingTiers);
router.delete('/bulk', protectAdmin, bulkDeletePricingTiers);
router.post('/', protectAdmin, createPricingTier);
router.put('/:id', protectAdmin, updatePricingTier);
router.delete('/:id', protectAdmin, deletePricingTier);

module.exports = router;
