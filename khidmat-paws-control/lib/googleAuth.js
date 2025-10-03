// import { google } from 'googleapis';

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// let oauth2Client = null;

// export function getOAuth2Client() {
//   if (!oauth2Client) {
//     oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_SECRET,
//       REDIRECT_URI
//     );

//     oauth2Client.setCredentials({
//       refresh_token: REFRESH_TOKEN,
//     });

//     // Auto-refresh access tokens
//     oauth2Client.on('tokens', (tokens) => {
//       if (tokens.refresh_token) {
//         console.log('New refresh token received');
//         // Optionally save new refresh token to env/database
//       }
//       console.log('Access token refreshed');
//     });
//   }

//   return oauth2Client;
// }

// export async function refreshAccessToken() {
//   try {
//     const client = getOAuth2Client();
//     const { credentials } = await client.refreshAccessToken();
//     client.setCredentials(credentials);
//     console.log('Access token refreshed successfully');
//     return true;
//   } catch (error) {
//     console.error('Failed to refresh access token:', error);
//     return false;
//   }
// }

// export function getDriveClient() {
//   const client = getOAuth2Client();
//   return google.drive({
//     version: 'v3',
//     auth: client,
//   });
// }

// lib/googleAuth.js
import { google } from 'googleapis';

console.log('🔍 Debugging service account setup:');
console.log('CLIENT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('PROJECT_ID:', process.env.GOOGLE_PROJECT_ID);
console.log('HAS_PRIVATE_KEY:', !!process.env.GOOGLE_PRIVATE_KEY);

const serviceAccountAuth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export function getDriveClient() {
  return google.drive({
    version: 'v3',
    auth: serviceAccountAuth,
  });
}

// Remove these functions (no longer needed):
// - getOAuth2Client()
// - refreshAccessToken()