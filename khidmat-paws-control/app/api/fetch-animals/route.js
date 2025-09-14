import { connectToDatabase } from '@/lib/db'; // Import the connection function
import Animal from '@/lib/models/animal';
import Category from '@/lib/models/category';

export async function GET(req, res) {
    try {
        await connectToDatabase(); // Wait for promise to execute
        const { pet_type } = Object.fromEntries(new URL(req.url).searchParams);
        const results = []
        if (!pet_type) {
            // fetch all
            const animals = await Animal.find();
            results.push(...animals);
        }
        else if (pet_type == "dog") {
            // fetch dogs
            const category = await Category.findOne({ name: 'Dogs' });
            if (category) {
                const animals = await Animal.find({ category_id: category._id });
                results.push(...animals);
            } else {
                return new Response(JSON.stringify({ error: 'Dog category not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } 
        else if (pet_type == "cat") {
            // fetch cats
            const category = await Category.findOne({ name: 'Cats' });
            if (category) {
                const animals = await Animal.find({ category_id: category._id });
                results.push(...animals);
            } else {
                return new Response(JSON.stringify({ error: 'Cat category not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } 
        else if (pet_type == "bunny") {
            // fetch dogs
            const category = await Category.findOne({ name: 'Bunnies' });
            if (category) {
                const animals = await Animal.find({ category_id: category._id });
                results.push(...animals);
            } else {
                return new Response(JSON.stringify({ error: 'Bunny category not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } 
        else if (pet_type == "bird") {
            // fetch dogs
            const category = await Category.findOne({ name: 'Birds' });
            if (category) {
                const animals = await Animal.find({ category_id: category._id });
                results.push(...animals);
            } else {
                return new Response(JSON.stringify({ error: 'Bird category not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } 
        else {
            // return error for invalid pet_type
            return new Response(JSON.stringify({ error: 'Invalid pet type' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
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