// app/api/checkdb/route.js
import { connectToDatabase } from "@/lib/db"; // Import the connection function

export async function GET(req) {
  try {
    // Try to connect to the database
    await connectToDatabase(); // Mongoose manages the connection automatically

    return new Response(
      JSON.stringify({ message: "Connected to MongoDB successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to connect to database" }),
      { status: 500 }
    );
  }
}