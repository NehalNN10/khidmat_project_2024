import { connectToDatabase } from '@/lib/db';
import Animal from '@/lib/models/animal';
import Category from '@/lib/models/category';
import Media from '@/lib/models/media';
import AdoptionStatus from '@/lib/models/adoptionstatus';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all data with populated references using correct field names
    const categories = await Category.find({});
    const animals = await Animal.find({}).populate('category_id'); // Changed from 'category'
    const media = await Media.find({}).populate('animal_id');      // Changed from 'animal'
    const adoptionStatuses = await AdoptionStatus.find({})
      .populate('animal_id')    // Changed from 'animal'
      .populate('customer_id'); // Added customer population

    // Get counts
    const counts = {
      categories: await Category.countDocuments(),
      animals: await Animal.countDocuments(),
      media: await Media.countDocuments(),
      adoptionStatuses: await AdoptionStatus.countDocuments()
    };

    return new Response(JSON.stringify({
      counts,
      data: {
        categories,
        animals,
        media,
        adoptionStatuses
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}