// components/PetCard.js
'use client';

import { useRouter } from 'next/navigation';
import { Heart, MapPin, Calendar } from 'lucide-react';

const PetCard = ({ pet, isLiked, onToggleLike }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/pets/${pet._id}`);
  };

  // console.log(pet);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="relative">
        <img 
          src={pet.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop'}
          alt={pet.name}
          className="w-full h-48 object-cover group-hover:brightness-110 transition-all"
        />
        
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${
              isLiked 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            } transition-colors`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{pet.name}</h3>
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {pet.species || 'Pet'}
          </span>
        </div>
        
        {/* <p className="text-gray-600 mb-3 truncate">{pet.breed}</p> */}
        
        {/* <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{pet.age ?? "1 year"}</span>
          </div>
        </div> */}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pet.description || 'A loving pet looking for their forever home.'}
        </p>
        
        <button
          onClick={handleViewDetails}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Meet {pet.name}
        </button>
      </div>
    </div>
  );
};

export default PetCard;