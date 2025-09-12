import { google } from 'googleapis';
import {connectToDatabase} from '@/lib/db'; // Import DB connection
import Media from '@/lib/models/media';

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

const FOLDER_TO_MOVE = "3" // testing

export async function GET() {
  // Debug environment variables first
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

    // Test 1: Simple credentials test
    console.log('Testing credentials...');
    const testResponse = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    });
    console.log('Credentials test passed:', testResponse.data);

    // Test 2: Check if PARENT_FOLDER_ID exists and is accessible
    console.log('Testing parent folder access...');
    const folderTest = await drive.files.get({
      fileId: PARENT_FOLDER_ID,
      fields: 'id, name, mimeType'
    });
    console.log('Parent folder test passed:', folderTest.data);

    // Step 2: List subfolders within the PARENT_FOLDER
    const subfoldersResponse = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const subfolders = subfoldersResponse.data.files;
    console.log('Subfolders:', subfolders);

    // Step 3: List images within each subfolder
    let allImages = [];
    for (const subfolder of subfolders) {
      const imagesResponse = await drive.files.list({
        q: `'${subfolder.id}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
        fields: 'files(id, name, mimeType)',
      });
      const images = imagesResponse.data.files.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        parentFolderName: subfolder.name,
        media_url: `https://drive.google.com/uc?export=view&id=${file.id}`,
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
    console.error('Detailed error:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      details: error.response?.data
    });

    // Return the error message as JSON
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