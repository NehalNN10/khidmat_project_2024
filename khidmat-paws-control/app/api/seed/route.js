import { connectToDatabase } from '@/lib/db';
import Animal from '@/lib/models/animal';
import Media from '@/lib/models/media';
import AdoptionStatus from '@/lib/models/adoptionstatus';

export async function POST(req) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Check if the database is already seeded
    const existingAnimals = await Animal.countDocuments();
    if (existingAnimals > 0) {
      return new Response(JSON.stringify({ message: 'Database is already seeded.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
      // res.status(400).json({ message: 'Database is already seeded.' });
    }

    // Seed 50 animals
    const animals = [];
    for (let i = 1; i <= 50; i++) {
      animals.push({
        name: `Animal ${i}`,
        description: `Description for Animal ${i}`,
        status: i % 2 === 0 ? 'Adopted' : 'Available',
      });
    }

    const insertedAnimals = await Animal.insertMany(animals);

    // Seed 100 media objects (2 per animal on average)
    const media = [];
    for (const animal of insertedAnimals) {
      for (let i = 1; i <= 2; i++) {
        media.push({
          media_type: i % 2 === 0 ? 'Image' : 'Video',
          media_url: `https://example.com/media/animal${animal._id}_media${i}.jpg`,
          animal_id: animal._id,
        });
      }
    }

    await Media.insertMany(media);

    // Seed adoption statuses (1 status for each animal)
    const adoptionStatuses = [];
    for (const animal of insertedAnimals) {
      adoptionStatuses.push({
        animal_id: animal._id,
        status: animal.status === 'Available' ? 'Pending' : 'Adopted',
        updated_at: new Date(),
      });
    }

    await AdoptionStatus.insertMany(adoptionStatuses);
    return new Response(JSON.stringify({ message: 'Database seeded successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    // return res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding the database:', error);
    return new Response(JSON.stringify({ message: 'Error seeding the database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    // return res.status(500).json({ message: 'Error seeding the database' });
  }
}
