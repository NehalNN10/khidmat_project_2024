import { google } from 'googleapis';

const CLIENT_ID = "placeholder";
const CLIENT_SECRET = "placeholder";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "placeholder";
const PARENT_FOLDER_ID = "placeholder"; 
const BOUGHT_FOLDER_ID = "placeholder";

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
  try {
    // Step 1: List subfolders within the PARENT_FOLDER
    const subfoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const subfolders = subfoldersResponse.data.files;
    console.log('Subfolders:', subfolders);

    // Step 2: List images within each subfolder
    let allImages = [];
    for (const subfolder of subfolders) {
      const imagesResponse = await drive.files.list({
        q: `'${subfolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
        fields: 'files(id, name, mimeType)',
      });
      const images = imagesResponse.data.files.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        parentFolderName: subfolder.name,
      }));
      allImages = allImages.concat(images);
    }

    // Debugging: Log the API response
    console.log('All Images:', allImages);

    // Return the list of images as JSON
    return new Response(JSON.stringify({ files: allImages }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Debugging: Log any errors
    console.error('API Error:', error);

    // Return the error message as JSON
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// New function to move the folder "3" into the "BOUGHT" folder
export async function moveFolderToBought() {
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

let hasMovedFolder = false;

// Function to run the moveFolderToBought function once
async function runOnce() {
  if (!hasMovedFolder) {
    await moveFolderToBought();
    hasMovedFolder = true;
  }
}

// Run the function once at the start
runOnce();