// import { MongoClient, ServerApiVersion } from 'mongodb';

// const uri = process.env.MONGODB_URI;

// // Create a MongoClient instance
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm the connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensure the client will close when done
//     await client.close();
//   }
// }

// export async function GET(req) {
//   try {
//     await run(); // Run the MongoDB connection check
//     return new Response(JSON.stringify({ message: 'Connected to MongoDB successfully!' }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     return new Response(
//       JSON.stringify({ message: 'Failed to connect to database' }),
//       { status: 500 }
//     );
//   }
// }

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