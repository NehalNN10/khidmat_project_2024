import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2, Calendar, Tag } from 'lucide-react';

const PetDetails = ({ pet }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const petData = pet?.pet;
  // console.log('Pet data in PetDetails component:', petData);
  const mediaUrls = pet?.media_urls || [];
  const category = pet?.category || 'Unknown';

  const handleWhatsAppContact = () => {
    const message = `Hi, I'm interested in adopting ${petData?.name}!`;
    const whatsappUrl = `https://wa.me/+923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meet ${petData?.name}`,
          text: `Check out this adorable ${category} looking for a home!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  const formatAge = (age) => {
    if (!age) return 'Age unknown';
    return typeof age === 'number' ? `${age} year${age !== 1 ? 's' : ''}` : age;
  };

  if (!petData) {
    return <div className="text-center mt-10">No pet data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full transition-all ${
                isLiked 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                  : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-red-400'
              } shadow-md`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white text-gray-400 hover:bg-gray-50 hover:text-blue-500 shadow-md transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Image Gallery */}
            <div className="lg:w-3/5 relative">
              {mediaUrls.length > 0 ? (
                <div className="relative">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={mediaUrls[currentImageIndex]}
                      alt={petData?.name || 'Pet photo'}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      priority
                    />
                    
                    {/* Navigation Arrows */}
                    {mediaUrls.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {currentImageIndex + 1} / {mediaUrls.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Strip */}
                  {mediaUrls.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {mediaUrls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                            index === currentImageIndex 
                              ? 'ring-3 ring-blue-500 ring-offset-2' 
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`${petData?.name} photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">🐾</div>
                    <p>No photos available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pet Information */}
            <div className="lg:w-2/5 p-8 lg:p-12">
              <div className="h-full flex flex-col">
                {/* Pet Name and Basic Info */}
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {petData?.name || 'Unnamed Pet'}
                  </h1>
                  
                  {petData?.description && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {petData.description}
                    </p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-6 mb-8 flex-grow">
                  {/* <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Age</h3>
                      <p className="text-gray-600">{formatAge(petData?.pet?.age)}</p>
                    </div>
                  </div> */}

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Tag className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Category</h3>
                      <p className="text-gray-600 capitalize">{category || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Additional details can be added here */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-2">🏡 Looking for a loving home</h3>
                    <p className="text-sm text-gray-600">
                      This adorable pet is ready to bring joy and companionship to your family. 
                      Contact us to learn more about the adoption process.
                    </p>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="mt-auto">
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contact on WhatsApp
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Get in touch to learn more about adoption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;