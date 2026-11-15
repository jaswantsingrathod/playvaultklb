const express = require('express');
const router = express.Router();
const {
  getPublicRentalPlans,
  getAdminRentalPlans,
  createRentalPlan,
  updateRentalPlan,
  deleteRentalPlan,
} = require('../controllers/rentalPlanController');
const { protectAdmin } = require('../middleware/auth');

// Public route / or admin when routed through /api/admin/rental-plans
router.get('/', (req, res, next) => {
  if (req.baseUrl.includes('/admin')) {
    return protectAdmin(req, res, () => getAdminRentalPlans(req, res, next));
  }
  return getPublicRentalPlans(req, res, next);
});

// Admin routes with /admin prefix
router.get('/admin', protectAdmin, getAdminRentalPlans);
router.post('/admin', protectAdmin, createRentalPlan);
router.put('/admin/:id', protectAdmin, updateRentalPlan);
router.delete('/admin/:id', protectAdmin, deleteRentalPlan);

// Admin routes without /admin prefix
router.post('/', protectAdmin, createRentalPlan);
router.put('/:id', protectAdmin, updateRentalPlan);
router.delete('/:id', protectAdmin, deleteRentalPlan);

module.exports = router;
