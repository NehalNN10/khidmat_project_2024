const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Use relative paths instead of aliases
const { connectToDatabase } = require("../lib/db.js");
const Category = require("../lib/models/category.js");

// Define the categories to be seeded with category_id
const categories = [
  { name: "Dogs" },
  { name: "Cats" },
  { name: "Bunnies" },
  { name: "Birds" },
];

async function seedCategories() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Insert the categories into the database
    const insertedCategories = await Category.insertMany(categories);

    console.log(
      `Successfully inserted ${insertedCategories.length} categories.`
    );

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

// Call the seed function
seedCategories();
