'use client'
import { SAMPLE_PETS } from '@/constants'
import { useParams } from 'next/navigation'

const PetDetailsPage = () => {
  const { id } = useParams()
  // currently fetching from a list, db or backend call will be made here
  const pet = SAMPLE_PETS.find((p) => p.id === id)

  if (!pet) {
    return <div className="text-center mt-10">Pet not found</div>
  }

  return <PetDetails pet={pet}/>
}

export default PetDetailsPage