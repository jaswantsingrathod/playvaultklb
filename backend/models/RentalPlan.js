const mongoose = require('mongoose');

const rentalPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Plan slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    durationLabel: {
      type: String,
      required: [true, 'Duration label is required'], // e.g. "1 Day", "2 Days", "3 Days", "1 Week"
      trim: true,
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration in hours is required'], // e.g. 8, 32, 56, 80, 120, 144, 168
      min: [1, 'Duration must be at least 1 hour'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
      min: [0, 'Original price must be positive'],
    },
    description: {
      type: String,
      default: 'Complete next-gen PlayStation 5 console gaming setup delivered to your door.',
      trim: true,
    },
    inclusions: {
      type: [String],
      default: [
        'PS5 Console (Disk/Digital)',
        '1 DualSense Wireless Controller',
        '24/7 Dedicated Support',
        'GTA VI / Top AAA Games Included',
        'Ultra High Speed HDMI Cable',
        'Power & Charging Cables'
      ],
    },
    badge: {
      type: String,
      default: '', // e.g. "Most Popular", "Best Value", "Weekend Favorite"
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// slug already has unique: true index
rentalPlanSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('RentalPlan', rentalPlanSchema);
