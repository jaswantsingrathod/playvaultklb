const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);
router.put('/change-password', protectAdmin, changePassword);
router.post('/logout', protectAdmin, logout);

module.exports = router;
