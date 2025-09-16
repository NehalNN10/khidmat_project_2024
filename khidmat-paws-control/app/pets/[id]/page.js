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

  // Fetch pets from API with pagination
  const fetchPet = useCallback(async (pet_id) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('id', pet_id);
      
      const response = await axios.get(`/api/fetch-single-animal?${params.toString()}`);
      const data = response.data;
      // console.log('Fetched pets data:', data);
      
      setPet(data || null);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPet(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchPet(id);
  }, [id, fetchPet]);
  
  if (loading) {
    return <LoadingSpinner />
  }
  else if (!pet) {
    return <div className="text-center mt-10">Pet not found</div>
  }
  return <PetDetails pet={pet}/>
}

export default PetDetailsPage