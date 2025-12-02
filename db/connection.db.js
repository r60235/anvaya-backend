const mongoose = require("mongoose");
require("dotenv").config();
const dbURI = process.env.MONGODB;

let cachedDb = null;

const connectDB = async () => {
  // Reuse existing connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = mongoose.connection;
    console.log("New database connection established");
    return cachedDb;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
