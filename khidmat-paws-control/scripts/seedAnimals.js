// IMPORTANT NOTE: for the seeding to work, we need the folders
// following this naming convention:

// <CATEGORY>_<ANIMAL_NAME>
// e.g. Cat_Beluga

const dotenv = require("dotenv");
const path = require("path");
const { google } = require("googleapis");

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Use relative paths instead of aliases
const { connectToDatabase } = require("../lib/db.js");
const Category = require("../lib/models/category.js");
const Animal = require("../lib/models/animal.js");

// Google Drive API setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

function getCategory(str) {
  if (str === "Bunny") return "Bunnies";
  else return str + "s";
}

// Get next available animal_id
async function getNextAnimalId() {
  try {
    const lastAnimal = await Animal.findOne().sort({ animal_id: -1 });
    return lastAnimal ? lastAnimal.animal_id + 1 : 1;
  } catch (error) {
    console.error("Error getting next animal ID:", error);
    return 1;
  }
}

async function seedAnimals() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Step 1: List subfolders in the parent folder
    const subfoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name)",
    });

    const subfolders = subfoldersResponse.data.files;

    if (subfolders.length === 0) {
      console.log("No subfolders found");
      return;
    }

    console.log("Found subfolders:", subfolders);

    // Get starting animal_id
    let currentAnimalId = await getNextAnimalId();

    // Step 2: Loop through subfolders to extract category and animal name
    const animalsToSeed = [];
    for (const subfolder of subfolders) {
      const [categoryName, animalName] = subfolder.name.split("_");
      const categoryNameFormatted = getCategory(categoryName);

      // Step 3: Find the category in the Category collection
      const category = await Category.findOne({ name: categoryNameFormatted });
      if (!category) {
        console.error(`Category "${categoryNameFormatted}" not found`);
        continue;
      }

      // Step 4: Create an animal document for each folder
      const animal = {
        animal_id: currentAnimalId++,
        name: animalName,
        description: `A lovely ${categoryNameFormatted
          .slice(0, -1)
          .toLowerCase()} named ${animalName}`, // Generate basic description
        category_id: category._id,
      };
      animalsToSeed.push(animal);
    }

    // Step 5: Insert animals into the Animal collection
    if (animalsToSeed.length > 0) {
      const insertedAnimals = await Animal.insertMany(animalsToSeed);
      console.log(`Successfully inserted ${insertedAnimals.length} animals.`);

      // Log each inserted animal
      insertedAnimals.forEach((animal) => {
        console.log(
          `Animal ID: ${animal.animal_id}, Name: ${animal.name}, Category_ID: ${animal.category_id}`
        );
      });
    } else {
      console.log("No animals to insert");
    }

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding animals:", error);
    process.exit(1);
  }
}

// Call the seed function
seedAnimals();

// TODO: make this happen in the background
// TODO: don't create duplicates