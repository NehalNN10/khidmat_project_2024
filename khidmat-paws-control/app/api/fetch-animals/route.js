import { connectToDatabase } from '@/lib/db'; // Import the connection function
import Animal from '@/lib/models/animal';
import Category from '@/lib/models/category';

export async function GET() {
    try {
        await connectToDatabase(); // Wait for promise to execute

        const cnt = await Animal.countDocuments();
        console.log(`Total animals in DB: ${cnt}`);
        
        const results = []
        const all_categories = await Category.find();
        console.log('All categories in DB: ', all_categories);
        
        // const cats = await Animal.find({species: 'Cat'});
        // console.log('Cats in DB: ', cats);
        
        for (let cat of all_categories) {
            let animals_in_cat = await Animal.find({category: cat._id});
            console.log(`Animals in category ${cat.name}: `, animals_in_cat);
            results.push({category: cat.name, animals: animals_in_cat});
        }
        
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        console.log('Error fetching animals: ', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch animals' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// TODO: Edit so that type of animal is present in DB