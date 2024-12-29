'use client'
import React, { useState } from 'react';
import Image from 'next/image';

const images = [
    '/hero_c.jpeg',
    '/hero_a.jpeg',
    '/hero_b.jpeg',
];

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
    <div className='container mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-center'>
    <h2 className='font-lato text-darkbrown text-2xl md:text-3xl lg:text-4xl font-semibold italic text-center mt-4'>Featured Pets</h2>
    <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center h-screen w-screen">
      <div className="relative w-4/5 h-4/5">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800 text-white"
          onClick={goToPreviousImage}
        >
          &lt;
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800 text-white"
          onClick={goToNextImage}
        >
          &gt;
        </button>
        <Image
          className="w-full h-full object-cover"
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          width={720}
          height={600}
          // layout='fill'
        />
      </div>
      <div className="mt-4 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full ${
              index === currentImageIndex
                ? 'bg-darkbrown'
                : 'bg-gray-300'
            }`}
            onClick={() => goToImage(index)}
          />
        ))}
      </div>
    </div>
    
    </div>
    </>
  );
};

export default ImageSlider;
