// filepath: /c:/Users/Dell/Documents/uni_docs/khidmat/code/khidmat-paws-control/seed.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function seedDatabase() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('mydatabase'); // Replace 'mydatabase' with your database name
        const collection = database.collection('mycollection'); // Replace 'mycollection' with your collection name

        const seedData = [
            {"_id":{"$oid":"678a7c4bb50c4c21b2ef945a"},"age":"2","breed":"Golden Retriever","description":"Friendly golden retriever","name":"Max","species":"Dog","status":"Available"},
            {"_id":{"$oid":"678a7c4bb50c4c21b2ef945b"},"age":"1","breed":"Domestic Shorthair","description":"Playful domestic shorthair","name":"Whiskers","species":"Cat","status":"Adopted"},
            {"_id":{"$oid":"678a7c4bb50c4c21b2ef945c"},"age":"3","breed":"Beagle Mix","description":"Lovable beagle mix","name":"Buddy","species":"Dog","status":"Available"},
            {"_id":{"$oid":"678a7c4bb50c4c21b2ef945d"},"age":"10","breed":"Domestic Longhair","description":"Sweet senior cat","name":"Mittens","species":"Cat","status":"Available"},
            {"_id":{"$oid":"678a7c4bb50c4c21b2ef945e"},"age":"2","breed":"Pitbull Mix","description":"Energetic pitbull mix","name":"Rocky","species":"Dog","status":"Adopted"}
        ];

        const result = await collection.insertMany(seedData);
        console.log(`${result.insertedCount} documents were inserted`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

seedDatabase();