import { google } from 'googleapis';
import {connectToDatabase} from '@/lib/db'; 
import Animal from '@/lib/models/animal';  
import Category from '@/lib/models/category';   
import Media from '@/lib/models/media';
import AdoptionStatus from '@/lib/models/adoptionstatus'; 

// OAuth2 Setup for Google Drive API
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

export async function POST() {
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
    // Connect to database
    await connectToDatabase();

    // try {
    //   await Animal.collection.drop();
    //   console.log('Dropped animals collection');
    // } catch (error) {
    //   console.log('Animals collection did not exist');
    // }

    // try {
    //   await Category.collection.drop();
    //   console.log('Dropped categories collection');
    // } catch (error) {
    //   console.log('Categories collection did not exist');
    // }

    // try {
    //   await Media.collection.drop();
    //   console.log('Dropped media collection');
    // } catch (error) {
    //   console.log('Media collection did not exist');
    // }

    // try {
    //   await AdoptionStatus.collection.drop();
    //   console.log('Dropped adoption statuses collection');
    // } catch (error) {
    //   console.log('Adoption statuses collection did not exist');
    // }
    
    // console.log('All collections dropped - starting fresh');

    // Get all category folders (Cats, Dogs, Bunnies, Birds, Bought)
    const categoryFoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const categoryFolders = categoryFoldersResponse.data.files;
    console.log('Category folders:', categoryFolders);

    // Get or create categories in database (excluding Bought folder)
    const categoryMap = {};
    for (const categoryFolder of categoryFolders) {
      const categoryName = categoryFolder.name;
      const isBoughtFolder = categoryName.toLowerCase() === 'bought';
      
      if (!isBoughtFolder) {
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await Category.create({ name: categoryName });
          console.log(`Created new category: ${categoryName}`);
        }
        categoryMap[categoryName] = category._id;
      }
    }

    // Track animals in bought folder to update their adoption status if required
    const boughtAnimals = new Set();
    let createdAnimals = 0;
    let updatedStatuses = 0;
    let createdMedia = 0;

    // Process each category folder
    for (const categoryFolder of categoryFolders) {
      const categoryName = categoryFolder.name;
      const isBoughtFolder = categoryName.toLowerCase() === 'bought';

      // Get animal subfolders within each category
      const animalFoldersResponse = await drive.files.list({
        q: `'${categoryFolder.id}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });

      const animalFolders = animalFoldersResponse.data.files;

      // Process each animal folder
      for (const animalFolder of animalFolders) {
        const animalName = animalFolder.name;
        
        if (isBoughtFolder) {
          // Just track that this animal is in bought folder
          boughtAnimals.add(animalName);
          console.log(`Found ${animalName} in Bought folder`);
          continue; // Nothing more needed - assumption: no animal's first appearance will be in the bought folder
        }

        // For regular category folders: create/update animal
        let animal = await Animal.findOne({ name: animalName });
        
        if (!animal) {
          // Create new animal (first time seeing it)
          animal = await Animal.create({
            name: animalName,
            description: `A lovely ${categoryName.slice(0, -1).toLowerCase()} looking for a home`,
            category_id: categoryMap[categoryName],
          });
          console.log(`Created new animal: ${animalName} in category ${categoryName}`);
          createdAnimals++;

          // Create initial adoption status (always Available for new animals)
          await AdoptionStatus.create({
            animal_id: animal._id, 
            status: 'Available',
            customer_id: null
          });
        }

        // Get media files within the animal folder
        const mediaResponse = await drive.files.list({
          q: `'${animalFolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='video/mp4')`,
          fields: 'files(id, name, mimeType)',
        });

        const mediaFiles = mediaResponse.data.files;

        // Create media records (only new ones)
        for (const mediaFile of mediaFiles) {
          const mediaType = mediaFile.mimeType.startsWith('image/') ? 'image' : 'video';
          const mediaUrl = `https://drive.google.com/uc?export=download&id=${mediaFile.id}`;

          const existingMedia = await Media.findOne({ 
            media_url: mediaUrl, 
            animal_id: animal._id 
          });

          if (!existingMedia) {
            await Media.create({
              media_type: mediaType,
              media_url: mediaUrl,
              animal_id: animal._id 
            });
            console.log(`Added new media: ${mediaFile.name} for ${animalName}`);
            createdMedia++;
          }
        }
      }
    }

    // Now update adoption statuses based on bought folder contents
    const allAnimals = await Animal.find({});
    
    for (const animal of allAnimals) {
      const adoptionStatus = await AdoptionStatus.findOne({ animal_id: animal._id });
      
      if (adoptionStatus) {
        const isInBoughtFolder = boughtAnimals.has(animal.name);
        const shouldBeAdopted = isInBoughtFolder;
        const currentlyAdopted = adoptionStatus.status === 'Adopted';

        if (shouldBeAdopted && !currentlyAdopted) {
          // Animal moved TO bought folder
          adoptionStatus.status = 'Adopted';
          await adoptionStatus.save();
          console.log(`✅ ${animal.name} moved to Bought -> status changed to Adopted`);
          updatedStatuses++;
        } else if (!shouldBeAdopted && currentlyAdopted) {
          // Animal moved BACK FROM bought folder
          adoptionStatus.status = 'Available';
          adoptionStatus.customer_id = null; // Clear customer
          await adoptionStatus.save();
          console.log(`🔄 ${animal.name} moved back from Bought -> status changed to Available`);
          updatedStatuses++;
        }
      }
    }

    const animalCount = await Animal.countDocuments();
    const categoryCount = await Category.countDocuments();
    const mediaCount = await Media.countDocuments();
    const adoptionStatusCount = await AdoptionStatus.countDocuments();

    const response = {
      message: 'Database updated successfully from Google Drive!',
      changes: {
        animals_created: createdAnimals,
        adoption_statuses_updated: updatedStatuses,
        media_created: createdMedia
      },
      summary: {
        total_categories: categoryCount,
        total_animals: animalCount,
        total_media: mediaCount,
        total_adoption_statuses: adoptionStatusCount
      }
    };

    console.log('Database update completed:', response);

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