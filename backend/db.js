const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      console.log("   Please add: MONGO_URI=mongodb://localhost:27017/transportDB");
      process.exit(1);
    }

    const options = {
      // These options are no longer needed in Mongoose 6+, but keeping for clarity
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("\n   Troubleshooting:");
    console.log("   1. Ensure MongoDB is running locally");
    console.log("   2. Check MONGO_URI in .env file");
    console.log("   3. For MongoDB Atlas, check network access settings\n");
    process.exit(1);
  }
};

module.exports = connectDB;
