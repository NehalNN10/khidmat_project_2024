"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin, Calendar } from 'lucide-react';

export const FeaturedPets = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredPets = [
    {
      id: 1,
      name: 'Luna',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'Main Shelter',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      description: 'Luna is a gentle and friendly dog who loves playing fetch and cuddling.',
      urgent: false
    },
    {
      id: 2,
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: '3 years',
      location: 'Foster Home',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      description: 'Whiskers is a calm lap cat who purrs loudly and loves gentle pets.',
      urgent: true
    },
    {
      id: 3,
      name: 'Buddy',
      type: 'Dog',
      breed: 'Labrador Mix',
      age: '1 year',
      location: 'Main Shelter',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      description: 'Buddy is an energetic puppy who loves walks and meeting new people.',
      urgent: false
    },
    {
      id: 4,
      name: 'Mittens',
      type: 'Cat',
      breed: 'Tabby',
      age: '4 months',
      location: 'Foster Home',
      image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop',
      description: 'Mittens is a playful kitten who loves toys and sunny windowsills.',
      urgent: false
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPets.length) % featuredPets.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Pets</h2>
          <p className="text-lg text-gray-600">Meet some of our wonderful animals looking for their forever homes</p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden rounded-xl mx-12">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredPets.map((pet) => (
                <div key={pet.id} className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                      {/* Pet Image */}
                      <div className="relative">
                        {pet.urgent && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            Urgent
                          </div>
                        )}
                        <img 
                          src={pet.image} 
                          alt={pet.name}
                          className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                      
                      {/* Pet Details */}
                      <div className="flex flex-col justify-center">
                        <h3 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                        <p className="text-xl text-gray-600 mb-4">{pet.breed} • {pet.type}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                            <span>{pet.age} old</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                            <span>{pet.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">{pet.description}</p>
                        
                        <div className="flex gap-4">
                          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                            Meet {pet.name}
                          </button>
                          <button className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {featuredPets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
