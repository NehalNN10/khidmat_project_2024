import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (  
    <section className='container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center mt-8 mb-4'>
      <div className='flex flex-col items-start gap-6 w-3/5'>
        <h1 className='text-darkbrown font-lato text-3xl md:text-4xl lg:text-5xl font-bold italic'>PAWS: Giving Every Paw a Second Chance</h1>
				<h3 className='text-gray-400 leading-relaxed text-lg md:text-xl w-4/5'>At PAWS, we're more than a shelter - we're a lifeline for abandoned animals seeking love, care, and forever homes. Join us in transforming their stories of neglect into tales of hope and happiness. Together, we can make every paw count. 🐾❤️</h3>
				<button className='block px-4 md:px-8 py-1.5 md:py-3 mb-2 leading-loose text-md text-center text-white font-bold bg-lightbrown hover:bg-darkbrown  rounded-full'>
          <Link href='/pet-catalog'>
            Explore Pets
          </Link>
        </button>
      </div>  
			
			<div className='w-1/2'>
        <Image
					src='/main_hero.jpeg'
					alt='hero img'
					width={720}
					height={600}
          className='object-contain aspect-auto'
				/>
      </div>  
    </section>
  )
}
export default Hero
