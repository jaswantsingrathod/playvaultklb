const mongoose = require('mongoose');

const adminActivityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    adminName: {
      type: String,
      default: 'Admin',
    },
    action: {
      type: String,
      required: true, // e.g. "LOGIN", "CREATE_GAME", "UPDATE_GAME", "DELETE_GAME", "UPDATE_PRICING", "UPDATE_SETTINGS"
    },
    module: {
      type: String,
      required: true, // e.g. "Auth", "Games", "Categories", "Pricing", "RentalPlans", "Settings", "Media"
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

adminActivityLogSchema.index({ createdAt: -1 });
adminActivityLogSchema.index({ module: 1 });

module.exports = mongoose.model('AdminActivityLog', adminActivityLogSchema);
