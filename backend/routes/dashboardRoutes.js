const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getActivityLogs,
  bulkDeleteActivityLogs,
} = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', protectAdmin, getDashboardStats);
router.get('/logs', protectAdmin, getActivityLogs);
router.post('/logs/bulk-delete', protectAdmin, bulkDeleteActivityLogs);
router.delete('/logs/bulk', protectAdmin, bulkDeleteActivityLogs);

module.exports = router;
