import { connectToDatabase } from '@/lib/db'; // Import the connection function
import Animal from '@/lib/models/animal';

export default async function handler(req, res)
{
    try {
        await connectToDatabase(); // Wait for promise to execute

        const dogs = await Animal.find({species: "Dog", status:"Available"}); // get all available dogs

        res.status(200).json(dogs); // return a JSON object containing all available dogs
    }
    catch (error)
    {
        console.log('Error fetching dogs: ', error);
        res.status(500).json({message: "Error fetching the dogs"});
    }
}

// TODO: Edit so that type of animal is present in DB