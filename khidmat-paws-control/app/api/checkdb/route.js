// app/api/checkdb/route.js
import { connectToDatabase } from '@/lib/db'; // Import the connection function

export async function GET(req) {
  try {
    // Connect to the database
    const db = await connectToDatabase();

    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });

    return new Response(
      JSON.stringify({ message: 'Connected to MongoDB successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to connect to database' }),
      { status: 500 }
    );
  }
}