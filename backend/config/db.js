const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/playvault';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Auto-seed if database is empty (e.g. on new cloud MongoDB deployment)
    try {
      const Admin = require('../models/Admin');
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        console.log('[MongoDB] Empty database detected. Auto-seeding initial PlayVaultKLB data...');
        const { seedDatabase } = require('../utils/seedData');
        await seedDatabase();
        console.log('[MongoDB] Auto-seeding completed successfully.');
      }
    } catch (seedErr) {
      console.warn('[MongoDB] Auto-seed check skipped or encountered error:', seedErr.message);
    }

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error with URI (${uri.replace(/:([^:@]+)@/, ':****@')}):`, error.message);
    
    // If external URI failed and it wasn't already local, try local MongoDB fallback
    if (uri !== 'mongodb://127.0.0.1:27017/playvault') {
      try {
        console.log('[MongoDB] Attempting fallback to local MongoDB instance: mongodb://127.0.0.1:27017/playvault');
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/playvault', {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Fallback connected to: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackErr) {
        console.error('[MongoDB] Local fallback also failed:', fallbackErr.message);
        throw fallbackErr;
      }
    }
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection lost. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Runtime error:', err.message);
});

module.exports = connectDB;
