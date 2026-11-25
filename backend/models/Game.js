const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Game slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    bannerImage: {
      type: String,
      default: '',
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameCategory',
      required: false,
    },
    platform: {
      type: String,
      default: 'PS5',
      trim: true,
    },
    hourlyPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    dailyPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    specialPrice: {
      type: Number,
      default: null,
      min: [0, 'Price must be positive'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    releaseYear: {
      type: Number,
      default: 2024,
    },
    tags: {
      type: [String],
      default: ['4K HDR', 'DualSense Haptics', '60 FPS'],
    },
    players: {
      type: String,
      default: '1-2 Players',
      trim: true,
    },
    storageRequired: {
      type: String,
      default: '75 GB',
      trim: true,
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
gameSchema.index({ isActive: 1, isDeleted: 1, isFeatured: 1 });
gameSchema.index({ genre: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Game', gameSchema);
