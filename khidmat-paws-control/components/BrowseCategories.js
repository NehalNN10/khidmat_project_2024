import CategoryCard from "./CategoryCard"
import { categoryPicArr } from "@/constants"

const BrowseCategories = () => {
  
	return (
    <>
	<section id='categories' className='container mx-auto px-4 sm:px-6 md:px-8'>
    <h2 className='font-lato text-darkbrown text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-center italic'>Browse Categories</h2>
	{/* <div className="flex flex-col items-center justify-center h-screen w-screen"> */}
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
			{categoryPicArr.map(({src, name, slug}) => (
        <CategoryCard src={src} name={name} slug={slug} key={'category '+name}/>
      ))}
		</div>
  </section>
		
    {/* </div> */}
	</>
  )
}

export default BrowseCategories
