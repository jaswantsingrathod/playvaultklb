const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const gameRoutes = require('./routes/gameRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const rentalPlanRoutes = require('./routes/rentalPlanRoutes');
const settingRoutes = require('./routes/settingRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    brand: 'PlayVaultKLB',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/rental-plans', rentalPlanRoutes);
app.use('/api/settings', settingRoutes);

// Dual Admin Route Mounts for REST conventions
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/games', gameRoutes);
app.use('/api/admin/pricing', pricingRoutes);
app.use('/api/admin/rental-plans', rentalPlanRoutes);
app.use('/api/admin/settings', settingRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const fs = require('fs');

// Serve static frontend in production if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api') && !req.originalUrl.startsWith('/uploads')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// 404 handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PlayVaultKLB Backend running on port ${PORT}`);
  console.log(`🎮 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n[Server] Gracefully shutting down...');
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close(false);
      console.log('[MongoDB] Database connection closed.');
    } catch (e) {
      console.error('[MongoDB] Error during disconnect:', e);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
