import { Calendar, ChevronRight } from 'lucide-react';
import Link from "next/link";

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/hero_0.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'
          // backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            PAWS Control
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-50 mb-8 max-w-3xl mx-auto leading-relaxed">
            Help us find loving homes for our furry friends. Adopt, don't shop!
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/pets">
              <button className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-primary-400 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center cursor-pointer">
                View Pets
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-200">Rescues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">300+</div>
              <div className="text-primary-200">Adoptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-200">In Our Shelter</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">20+</div>
              <div className="text-primary-200">Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;