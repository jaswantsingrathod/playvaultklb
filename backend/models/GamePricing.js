const mongoose = require('mongoose');

const gamePricingSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Associated game is required'],
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration in hours is required'],
      min: [1, 'Duration must be at least 1 hour'],
    },
    title: {
      type: String,
      required: [true, 'Pricing tier title is required'], // e.g. "1 Day Pass", "2 Days Weekend Pass", "3 Days Pro Pass", "7 Days Weekly Pass"
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Rental price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null, // For showing strikethrough discount
      min: [0, 'Original price must be positive'],
    },
    pricingType: {
      type: String,
      enum: ['daily', 'multi-day', 'weekly', 'package', 'promotional', 'custom', 'hourly', 'multi-hour'],
      default: 'daily',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    badge: {
      type: String,
      default: '', // e.g. "Save 15%", "Most Popular", "Weekend Special"
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

gamePricingSchema.index({ game: 1, isActive: 1, durationHours: 1 });
gamePricingSchema.index({ game: 1, displayOrder: 1 });

module.exports = mongoose.model('GamePricing', gamePricingSchema);
