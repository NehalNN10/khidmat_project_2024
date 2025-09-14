// components/PetsPageClient.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import CategoryFilter from '@/components/CategoryFilter';
import PetCard from '@/components/PetCard';
import Pagination from '@/components/Pagination';

const PetsPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [likedPets, setLikedPets] = useState(new Set());

  const categories = [
    { key: 'all', label: 'All Pets', count: null },
    { key: 'dog', label: 'Dogs', count: 47 },
    { key: 'cat', label: 'Cats', count: 32 },
    { key: 'bird', label: 'Birds', count: 15 },
    { key: 'bunny', label: 'Bunnies', count: 23 }
  ];

  // Fetch pets from API with pagination
  const fetchPets = useCallback(async (petType = 'all', pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      });
      
      if (petType !== 'all') {
        params.append('pet_type', petType);
      }

      const response = await axios.get(`/api/fetch-animals?${params.toString()}`);
      const data = response.data;
      // console.log('Fetched pets data:', data);
      
      setPets(data || []);
      // setPets(data.pets || []);
      setPagination(data.pagination || {
        page: pageNum,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      });
      
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
      setPagination({
        page: pageNum,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    
    setActiveCategory(category);
    
    // Update URL and fetch first page
    updateUrlAndFetch(category, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    updateUrlAndFetch(activeCategory, newPage);
    
    // Scroll to top of results
    const resultsSection = document.querySelector('.pets-grid-container');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update URL and fetch data
  const updateUrlAndFetch = (category, page) => {
    const params = new URLSearchParams();
    
    if (category !== 'all') {
      params.set('pet_type', category);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/pets?${queryString}` : '/pets';
    
    router.push(newUrl);
    fetchPets(category, page);
  };

  // Handle like toggle
  const toggleLike = (petId) => {
    setLikedPets(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(petId)) {
        newLiked.delete(petId);
      } else {
        newLiked.add(petId);
      }
      return newLiked;
    });
  };

  // Initialize page based on URL query
  useEffect(() => {
    const petType = searchParams.get('pet_type') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    
    setActiveCategory(petType);
    fetchPets(petType, page);
  }, [searchParams, fetchPets]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader />

      {/* Category Filter Bar */}
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Results Count and Pagination Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <ResultsCount pagination={pagination} activeCategory={activeCategory} />
          {pagination.totalPages > 1 && (
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Pets Grid Container */}
      <div className="pets-grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <LoadingSpinner />
        ) : pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {pets.map((pet) => (
                <PetCard 
                  key={pet._id} 
                  pet={pet} 
                  isLiked={likedPets.has(pet._id)}
                  onToggleLike={() => toggleLike(pet._id)}
                />
              ))}
            </div>
            
            {/* Pagination Component */}
            {pagination.totalPages > 1 && (
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyState activeCategory={activeCategory} />
        )}
      </div>
    </div>
  );
};

export default PetsPageClient;

const PageHeader = () => (
  <div className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Pet</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through our loving animals waiting for their forever homes
        </p>
      </div>
    </div>
  </div>
);

// components/ResultsCount.js
const ResultsCount = ({ pagination, activeCategory }) => (
  <p className="text-gray-600">
    {pagination.total > 0 
      ? `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} pets`
      : 'No pets found'
    }
    {activeCategory !== 'all' && ` in ${activeCategory}s`}
  </p>
);

// components/EmptyState.js
const EmptyState = ({ activeCategory }) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">🐾</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets found</h3>
    <p className="text-gray-600">
      {activeCategory !== 'all' 
        ? `No ${activeCategory}s available right now. Try selecting a different category.`
        : 'No pets available right now. Check back later for new arrivals.'
      }
    </p>
  </div>
);

// components/LoadingSpinner.js
import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex items-center gap-3 text-gray-600">
      <Loader className="w-6 h-6 animate-spin" />
      <span className="text-lg">Loading pets...</span>
    </div>
  </div>
);
