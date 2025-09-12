import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID; 
const BOUGHT_FOLDER_ID = process.env.BOUGHT_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const FOLDER_TO_MOVE = "3" // testing

export async function GET() {
  console.log('Environment variables check:', {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN ? 'Present' : 'Missing',
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  });

  if (!process.env.GOOGLE_CLIENT_ID) {
    return new Response(JSON.stringify({ 
      error: 'GOOGLE_CLIENT_ID environment variable is not set' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    // Get all category folders (Cats, Dogs, Bunnies, Birds, Bought)
    const categoryFoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const categoryFolders = categoryFoldersResponse.data.files;
    console.log('Category folders:', categoryFolders);

    let allAnimals = [];
    let allMedia = [];
    let categories = [];
    let adoptionStatuses = [];
    let animalCounter = 1;
    let mediaCounter = 1;
    let statusCounter = 1;

    // Process each category folder
    for (const categoryFolder of categoryFolders) {
      const categoryName = categoryFolder.name;
      const isBoughtFolder = categoryName.toLowerCase() === 'bought';
      
      // Add to categories if not "Bought" folder
      if (!isBoughtFolder) {
        categories.push({
          Category_ID: categories.length + 1,
          Name: categoryName
        });
      }

      // Get animal subfolders within each category
      const animalFoldersResponse = await drive.files.list({
        q: `'${categoryFolder.id}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });

      const animalFolders = animalFoldersResponse.data.files;

      // Process each animal folder
      for (const animalFolder of animalFolders) {
        const animalName = animalFolder.name;
        
        // Determine category for database
        let animalCategory;
        if (isBoughtFolder) {
          // Extract category from animal name (e.g., "Cat 1" -> "Cats")
          if (animalName.toLowerCase().startsWith('cat')) animalCategory = 'Cats';
          else if (animalName.toLowerCase().startsWith('dog')) animalCategory = 'Dogs';
          else if (animalName.toLowerCase().startsWith('bunny') || animalName.toLowerCase().startsWith('rabbit')) animalCategory = 'Bunnies';
          else if (animalName.toLowerCase().startsWith('bird')) animalCategory = 'Birds';
          else animalCategory = 'Unknown';
        } else {
          animalCategory = categoryName;
        }

        // Create animal record
        const animal = {
          Animal_ID: animalCounter,
          Name: animalName,
          Description: `A lovely ${animalCategory.slice(0, -1).toLowerCase()} looking for a home`, // Remove 's' from category
          Category: animalCategory
        };
        allAnimals.push(animal);

        // Create adoption status record (without Updated_At)
        const adoptionStatus = {
          Status_ID: statusCounter,
          Animal_ID: animalCounter,
          Customer_ID: null, // You might want to add logic to assign customer IDs for bought pets
          Status: isBoughtFolder ? 'Adopted' : 'Available'
        };
        adoptionStatuses.push(adoptionStatus);
        statusCounter++;

        // Get media files within the animal folder
        const mediaResponse = await drive.files.list({
          q: `'${animalFolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='video/mp4')`,
          fields: 'files(id, name, mimeType)',
        });

        const mediaFiles = mediaResponse.data.files;

        // Process each media file
        for (const mediaFile of mediaFiles) {
          const mediaType = mediaFile.mimeType.startsWith('image/') ? 'image' : 'video';
          const mediaUrl = `https://drive.google.com/uc?export=download&id=${mediaFile.id}`;

          const media = {
            Media_ID: mediaCounter,
            Media_type: mediaType,
            Media_URL: mediaUrl,
            Animal_ID: animalCounter
          };
          allMedia.push(media);
          mediaCounter++;
        }

        animalCounter++;
      }
    }

    // Return structured data for database
    const response = {
      categories: categories,
      animals: allAnimals,
      media: allMedia,
      adoption_statuses: adoptionStatuses,
      summary: {
        total_categories: categories.length,
        total_animals: allAnimals.length,
        total_media: allMedia.length,
        available_animals: adoptionStatuses.filter(status => status.Status === 'Available').length,
        adopted_animals: adoptionStatuses.filter(status => status.Status === 'Adopted').length
      }
    };

    console.log('Database-ready response:', response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      details: error.response?.data
    });

    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.response?.data 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// New function to move the folder "3" into the "BOUGHT" folder
// export async function moveFolderToBought() {
export async function POST() {
  try {
    // Step 1: Find the folder ID by name
    const folderResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and name='${FOLDER_TO_MOVE}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const folder = folderResponse.data.files[0];
    if (!folder) {
      throw new Error(`Folder with name "${FOLDER_TO_MOVE}" not found.`);
    }

    const folderId = folder.id;

    // Step 2: Move the folder to the "BOUGHT" folder
    const moveResponse = await drive.files.update({
      fileId: folderId,
      addParents: BOUGHT_FOLDER_ID,
      removeParents: PARENT_FOLDER_ID,
      fields: 'id, parents',
    });

    console.log('Move Response:', moveResponse.data);

    // Return the move response as JSON
    return new Response(JSON.stringify({ moveResponse: moveResponse.data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Debugging: Log any errors
    console.error('Move Folder Error:', error);

    // Return the error message as JSON
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}