import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = MongoClient.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      useNewUrlParser: true, // MongoDB new connection parser
      useUnifiedTopology: true, // Enable the new connection management engine
      connectTimeoutMS: 30000, // Increase connection timeout
      socketTimeoutMS: 30000, // Increase socket timeout
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = MongoClient.connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  });
}

export async function connectToDatabase() {
  client = await clientPromise;
  return client.db();
}
