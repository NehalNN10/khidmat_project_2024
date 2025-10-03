import { google } from 'googleapis';

export function getDriveClient() {
  try {
    // Parse JSON fresh every time
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    console.log('🔍 Creating fresh service account auth...');
    console.log('🔍 Email:', serviceAccountKey.client_email);
    
    // Create fresh auth instance every time
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    
    // Return fresh drive client
    return google.drive({
      version: 'v3',
      auth: auth,
    });
  } catch (error) {
    console.error('❌ Error creating Drive client:', error);
    throw error;
  }
}