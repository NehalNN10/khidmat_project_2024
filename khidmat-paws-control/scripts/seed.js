// scripts/seed.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env.local file
dotenv.config({ path: path.join(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const seedData = [
    {"age":"2","breed":"Golden Retriever","description":"Friendly golden retriever","name":"Max","species":"Dog","status":"Available"},
    {"age":"1","breed":"Domestic Shorthair","description":"Playful domestic shorthair","name":"Whiskers","species":"Cat","status":"Adopted"},
    {"age":"3","breed":"Beagle Mix","description":"Lovable beagle mix","name":"Buddy","species":"Dog","status":"Available"},
    {"age":"10","breed":"Domestic Longhair","description":"Sweet senior cat","name":"Mittens","species":"Cat","status":"Available"},
    {"age":"2","breed":"Pitbull Mix","description":"Energetic pitbull mix","name":"Rocky","species":"Dog","status":"Adopted"}
];

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const petsCollection = db.collection('pets');

    // Clear existing data
    await petsCollection.deleteMany({});
    console.log('Cleared existing pets data');

    // Insert new data
    const result = await petsCollection.insertMany(seedData);
    console.log(`Successfully seeded ${result.insertedCount} pets`);

    // Create indexes
    await petsCollection.createIndex({ species: 1 });
    await petsCollection.createIndex({ status: 1 });
    await petsCollection.createIndex({ breed: 1 });
    console.log('Created indexes');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedDatabase();