import { connectToDatabase } from '@/lib/db';
import Animal from '@/lib/models/animal';
import Media from '@/lib/models/media';
import Customer from '@/lib/models/customer';
import AdoptionStatus from '@/lib/models/adoptionstatus';

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Check if the database is already seeded
    const existingAnimals = await Animal.countDocuments();
    if (existingAnimals > 0) {
      return res.status(400).json({ message: 'Database is already seeded.' });
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

    // Seed 50 customers
    const customers = [];
    for (let i = 1; i <= 50; i++) {
      customers.push({
        name: `Customer ${i}`,
      });
    }

    const insertedCustomers = await Customer.insertMany(customers);

    // Seed adoption statuses (1 status for each animal)
    const adoptionStatuses = [];
    for (const animal of insertedAnimals) {
      const customer = insertedCustomers[Math.floor(Math.random() * insertedCustomers.length)];
      adoptionStatuses.push({
        animal_id: animal._id,
        customer_id: customer._id,
        status: animal.status === 'Available' ? 'Pending' : 'Adopted',
        updated_at: new Date(),
      });
    }

    await AdoptionStatus.insertMany(adoptionStatuses);

    return res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding the database:', error);
    return res.status(500).json({ message: 'Error seeding the database' });
  }
}
