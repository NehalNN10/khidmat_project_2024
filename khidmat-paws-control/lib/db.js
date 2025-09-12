import mongoose from "mongoose";
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log("Using existing database connection");
    return; // If already connected, don't connect again
  }

  try {
    await mongoose.connect(uri); // Mongoose handles the connection
    isConnected = true; // Mark as connected after successful connection
    console.log("Database connected with Mongoose");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}