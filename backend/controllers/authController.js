const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { logActivity } = require('../middleware/activityLogger');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'playvault_super_secret_jwt_key_2025',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/email and password.',
      });
    }

    const admin = await Admin.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { username: identifier.toLowerCase().trim() },
      ],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username/email and password.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your administrator account has been disabled. Please contact support.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username/email and password.',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = generateToken(admin._id);

    // Attach admin to request for logger
    req.admin = admin;
    await logActivity(req, 'LOGIN', 'Auth', `Admin ${admin.username} logged in successfully.`);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        avatar: admin.avatar,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, avatar } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another admin.',
        });
      }
      admin.email = email.toLowerCase().trim();
    }

    if (fullName) admin.fullName = fullName.trim();
    if (avatar !== undefined) admin.avatar = avatar;

    await admin.save();
    await logActivity(req, 'UPDATE_PROFILE', 'Auth', `Admin ${admin.username} updated profile information.`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    admin.password = newPassword;
    await admin.save();

    await logActivity(req, 'CHANGE_PASSWORD', 'Auth', `Admin ${admin.username} changed account password.`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please keep your credentials secure.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    await logActivity(req, 'LOGOUT', 'Auth', `Admin ${req.admin?.username || 'User'} logged out.`);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
