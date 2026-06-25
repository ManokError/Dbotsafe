const mongoose = require('mongoose');
const config = require('../config');

async function connectDB() {
  if (!config.mongoUri) {
    console.warn('MONGODB_URI is not defined; continuing without MongoDB persistence.');
    return false;
  }

  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed; continuing without database persistence:', error.message);
    return false;
  }
}

module.exports = { connectDB };
