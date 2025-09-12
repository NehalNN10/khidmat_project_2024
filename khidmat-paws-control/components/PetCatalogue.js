import { SAMPLE_PETS } from "@/constants"
import PetCard from "./PetCard"

const PetCatalogue = () => {
  return (
    <div className='container mx-auto my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-4/5 sm:w-11/12'>
      {SAMPLE_PETS.map((pet) => ( 
        <PetCard
          key={pet.id}
          name={pet.name}
          image={pet.image}
          id={pet.id}
          category={pet.category}
          breed={pet.breed}
          age={pet.age}
        />
      ))}
    </div>
  )
}

export default PetCatalogue
