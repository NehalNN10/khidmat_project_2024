import { syncWithGoogleDrive } from '@/lib/syncService';

export async function GET() {
  console.log('🔔 Cron job triggered at:', new Date().toISOString());

  try {
    const result = await syncWithGoogleDrive();
    
    return new Response(JSON.stringify({
      message: 'Cron job completed successfully',
      timestamp: new Date().toISOString(),
      ...result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return new Response(JSON.stringify({ 
      message: 'Cron job failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}