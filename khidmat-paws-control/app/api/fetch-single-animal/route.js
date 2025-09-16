import { connectToDatabase } from '@/lib/db';
import Animal from '@/lib/models/animal';
import Media from '@/lib/models/media';

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const pet = await Animal.findOne({ _id: id });
      if (!pet) {
        return new Response(JSON.stringify({ error: 'Pet not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
			const media_urls = [];

			const media = await Media.find({ animal_id: pet._id });
			for (let i = 0; i < media.length; i++) {
				// if (media[i].Media_type === 'image') {
				media_urls.push(media[i].media_url);
				// }
			}
			console.log('Media URLs: ', media_urls);
			pet.media_urls = media_urls;
			const result = {pet, media_urls};
			console.log('Fetched pet: ', result);

			return new Response(JSON.stringify(result), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
    }
		else {
			console.error('Error fetching pet, ID not provided: ', error);
    	return new Response(JSON.stringify({ error: 'Failed to fetch pet, no ID provided' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
  } catch (error) {
    console.error('Error fetching pet: ', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pet' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
