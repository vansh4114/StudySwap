const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting, wait for the pending connection promise
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return await cachedPromise;
  }

  // Disable command buffering so queries fail fast if connection fails instead of hanging forever
  mongoose.set('bufferCommands', false);

  cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000
  });

  try {
    const conn = await cachedPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
