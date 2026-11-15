const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getActivityLogs,
} = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', protectAdmin, getDashboardStats);
router.get('/logs', protectAdmin, getActivityLogs);

module.exports = router;
