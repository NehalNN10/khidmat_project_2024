import { connectToDatabase } from './db';
import { getDriveClient, refreshAccessToken } from './googleAuth';
import Animal from './models/animal';
import Category from './models/category';
import Media from './models/media';
import AdoptionStatus from './models/adoptionstatus';

const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID;

export async function syncWithGoogleDrive() {
  console.log('🔄 Starting Google Drive sync...');
  
  try {
    // Ensure we have a fresh token
    await refreshAccessToken();
    
    const drive = getDriveClient();

    await connectToDatabase();

    // try {
    //     await Animal.collection.drop();
    //     console.log('Dropped animals collection');
    // } catch (error) {
    //     console.log('Animals collection did not exist');
    // }

    // try {
    //     await Category.collection.drop();
    //     console.log('Dropped categories collection');
    // } catch (error) {
    //     console.log('Categories collection did not exist');
    // }

    // try {
    //     await Media.collection.drop();
    //     console.log('Dropped media collection');
    // } catch (error) {
    //     console.log('Media collection did not exist');
    // }

    // try {
    //     await AdoptionStatus.collection.drop();
    //     console.log('Dropped adoption statuses collection');
    // } catch (error) {
    //     console.log('Adoption statuses collection did not exist');
    // }
    
    // console.log('All collections dropped - starting fresh');

    // Get all category folders
    const categoryFoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const categoryFolders = categoryFoldersResponse.data.files;
    console.log('📁 Found category folders:', categoryFolders.map(f => f.name));

    // Get or create categories in database (excluding Bought folder)
    const categoryMap = {};
    for (const categoryFolder of categoryFolders) {
      const categoryName = categoryFolder.name;
      const isBoughtFolder = categoryName.toLowerCase() === 'bought';
      
      if (!isBoughtFolder) {
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await Category.create({ name: categoryName });
          console.log(`✅ Created new category: ${categoryName}`);
        }
        categoryMap[categoryName] = category._id;
      }
    }

    // Track animals in bought folder
    const boughtAnimals = new Set();
    let createdAnimals = 0;
    let updatedStatuses = 0;
    let createdMedia = 0;

    // Process each category folder
    for (const categoryFolder of categoryFolders) {
      const categoryName = categoryFolder.name;
      const isBoughtFolder = categoryName.toLowerCase() === 'bought';

      // Get animal subfolders
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
          console.log(`🏠 Found ${animalName} in Bought folder`);
          continue;
        }

        // Create/update animal
        let animal = await Animal.findOne({ name: animalName });
        
        if (!animal) {
          animal = await Animal.create({
            name: animalName,
            description: `A lovely ${categoryName.slice(0, -1).toLowerCase()} looking for a home`,
            category_id: categoryMap[categoryName],
          });
          console.log(`🐾 Created new animal: ${animalName}`);
          createdAnimals++;

          // Create initial adoption status
          await AdoptionStatus.create({
            animal_id: animal._id,
            status: 'Available'
          });
        }

        // Get media files
        const mediaResponse = await drive.files.list({
          q: `'${animalFolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='video/mp4')`,
          fields: 'files(id, name, mimeType)',
        });

        const mediaFiles = mediaResponse.data.files;

        // Create media records
        for (const mediaFile of mediaFiles) {
          const mediaType = mediaFile.mimeType.startsWith('image/') ? 'image' : 'video';
          const mediaUrl = `https://drive.google.com/thumbnail?id=${mediaFile.id}&sz=s4000`;

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
            console.log(`📸 Added media: ${mediaFile.name} for ${animalName}`);
            createdMedia++;
          }
        }
      }
    }

    // Update adoption statuses based on bought folder
    const allAnimals = await Animal.find({});
    
    for (const animal of allAnimals) {
      const adoptionStatus = await AdoptionStatus.findOne({ animal_id: animal._id });
      
      if (adoptionStatus) {
        const isInBoughtFolder = boughtAnimals.has(animal.name);
        const shouldBeAdopted = isInBoughtFolder;
        const currentlyAdopted = adoptionStatus.status === 'Adopted';

        if (shouldBeAdopted && !currentlyAdopted) {
          adoptionStatus.status = 'Adopted';
          await adoptionStatus.save();
          console.log(`✅ ${animal.name} adopted`);
          updatedStatuses++;
        } else if (!shouldBeAdopted && currentlyAdopted) {
          adoptionStatus.status = 'Available';
          await adoptionStatus.save();
          console.log(`🔄 ${animal.name} available again`);
          updatedStatuses++;
        }
      }
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      changes: {
        animals_created: createdAnimals,
        adoption_statuses_updated: updatedStatuses,
        media_created: createdMedia
      }
    };

    console.log('✅ Sync completed:', result);
    return result;

  } catch (error) {
    console.error('❌ Sync failed:', error);
    return { success: false, error: error.message };
  }
}