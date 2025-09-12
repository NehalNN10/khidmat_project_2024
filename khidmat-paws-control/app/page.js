import Hero from "@/components/Hero";
import { FeaturedPets } from "@/components/FeaturedPets"
import { PetCategories } from "@/components/PetCategories";
import { AdoptionProcess } from "@/components/AdoptionProcess";


export default function Home() {
  return (
    <>
      <Hero/>
      <PetCategories/>      
      <FeaturedPets/>
      <AdoptionProcess/>
      {/* <BrowseCategories/> */}
    </>
  );
}