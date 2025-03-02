import mongoose from "mongoose";

// Cache the connection to avoid creating multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If a connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection exists, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    // Create a connection promise
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/quickcart`, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  // Wait for the connection promise to resolve
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Reset the promise on error
    throw err;
  }

  return cached.conn;
}

export default connectDB;
