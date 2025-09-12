const dotenv = require("dotenv");
const path = require("path");
const { google } = require("googleapis");

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Import models
const { connectToDatabase } = require("../lib/db.js");
const Animal = require("../lib/models/animal.js");
const Media = require("../lib/models/media.js");
const Category = require("../lib/models/category.js");

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

// Function to seed media
async function seedMedia() {
  try {
    // Step 1: Connect to the database
    await connectToDatabase();

    // Step 2: List subfolders in the parent folder (similar to how animals were seeded)
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

    // Step 3: Loop through each subfolder to find media files
    const mediaToSeed = [];
    for (const subfolder of subfolders) {
      const [categoryName, animalName] = subfolder.name.split("_");
      const categoryNameFormatted = getCategory(categoryName); // Ensure the category ends with 's'

      // Step 4: Find the corresponding Category ID
        const category = await Category.findOne({ name: categoryNameFormatted });
        if (!category) {
            console.error(`Category "${categoryNameFormatted}" not found`);
            continue;
        }

      // Step 4: Find the corresponding Animal document
      const animal = await Animal.findOne({
        name: animalName,
        category_id: category._id,
      });
      if (!animal) {
        console.error(
          `Animal "${animalName}" not found in the "${categoryNameFormatted}" category`
        );
        continue; // Skip if animal not found
      }

      // Step 5: List media files (images and videos) within the subfolder
      const mediaResponse = await drive.files.list({
        q: `'${subfolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='video/mp4')`,
        fields: "files(id, name, mimeType)",
      });

      const mediaFiles = mediaResponse.data.files;
      console.log(
        `Found ${mediaFiles.length} media files in "${subfolder.name}"`
      );

      for (const file of mediaFiles) {
        const media = {
          media_type:
            file.mimeType === "image/jpeg" || file.mimeType === "image/png"
              ? "Image"
              : "Video",
          media_url: `https://drive.google.com/uc?export=view&id=${file.id}`, // Link to the media
          animal_id: animal._id, // Link to the Animal document
        };
        mediaToSeed.push(media);
      }
    }

    // Step 6: Insert the media data into the Media collection
    if (mediaToSeed.length > 0) {
      await Media.insertMany(mediaToSeed);
      console.log(`Successfully inserted ${mediaToSeed.length} media items.`);
    } else {
      console.log("No media to insert.");
    }

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding media:", error);
    process.exit(1);
  }
}

// Call the seed function
seedMedia();