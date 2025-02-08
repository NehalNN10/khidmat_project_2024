import Image from 'next/image';
import Link from 'next/link';

const PetCard = ({ name, image, id, category, breed, age }) => {
  return (
    <Link href={`/pets/${id}`} className='w-full'>
      <div className='w-full h-full bg-white shadow-lg rounded-xl overflow-hidden transition-transform hover:scale-105'>
        {/* Image Container */}
        <div className="relative h-48 w-full">
          <Image 
            className="object-cover w-full h-full" 
            src={image} 
            alt={name} 
            width={400}
            height={300}
          />
        </div>

        {/* Content Container */}
        <div className='p-4 space-y-3'>
          {/* Name */}
          <h3 className='text-2xl font-semibold text-center text-darkbrown truncate'>
            {name}
          </h3>

          {/* Details */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-gray-600'>
              <span>Species:</span>
              <span className='font-medium'>{category}</span>
            </div>
            <div className='flex items-center justify-between text-gray-600'>
              <span>Breed:</span>
              <span className='font-medium'>{breed}</span>
            </div>
            <div className='flex items-center justify-between text-gray-600'>
              <span>Age:</span>
              <span className='font-medium'>{age}</span>
            </div>
          </div>

          {/* Button */}
          <button className='w-full mt-4 px-4 py-2 bg-lightbrown text-white font-medium rounded-lg hover:bg-darkbrown transition-colors'>
            Check Availability
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;