'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PetDetails from '@/components/PetDetails';
import LoadingSpinner from '@/components/LoadingSpinner';

const PetDetailsPage = () => {
  const { id } = useParams()
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pets from API with pagination
  const fetchPet = useCallback(async (pet_id) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('id', pet_id);
      
      const response = await axios.get(`/api/fetch-single-animal?${params.toString()}`);
      const data = response.data;
      
      setPet(data || null);
    } catch (error) {
      console.error('Error fetching pet:', error);
      setError('Failed to load pet details. Please try again.');
      setPet(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (id) {
      fetchPet(id);
    }
  }, [id, fetchPet]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchPet(id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="text-gray-400 text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h2>
          <p className="text-gray-600">The pet you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <PetDetails pet={pet} />
    </div>
  );
}

export default PetDetailsPage