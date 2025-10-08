import { connectToDatabase } from '@/lib/db';
import Animal from '@/lib/models/animal';
import Category from '@/lib/models/category';

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const pet_type = searchParams.get('pet_type');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
		if (pet_type == "all") pet_type = null;
    const name_map = {
      dog: 'Dogs',
      cat: 'Cats',
      bunny: 'Bunnies',
      bird: 'Birds',
    };

    let matchStage = {};

    if (pet_type) {
      const category = await Category.findOne({ name: name_map[pet_type] });
      if (!category) {
        return new Response(JSON.stringify({ error: 'Invalid pet type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      matchStage.category_id = category._id;
    }

    const animals = await Animal.aggregate([
      { $match: matchStage },
      
      {
        $lookup: {
          from: 'adoptionstatuses',
          localField: '_id',
          foreignField: 'animal_id',
          as: 'adoptionStatus',
        },
      },
      
      {
        $match: {
          'adoptionStatus.status': 'Available'
        }
      },
      
      {
        $lookup: {
          from: 'media',
          localField: '_id',
          foreignField: 'animal_id',
          as: 'media',
        },
      },
      {
        $addFields: {
          media_url: { $arrayElemAt: ['$media.media_url', 0] },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          media_url: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
		// console.log('Fetched animals: ', animals);

    return new Response(JSON.stringify(animals), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching animals: ', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch animals' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
