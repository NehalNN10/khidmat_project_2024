import Link from "next/link";

// components/AdoptionProcess.js
export const AdoptionProcess = () => {
  const steps = [
    {
      number: '1',
      title: 'Browse & Find',
      description: 'Explore our available pets and find one that matches your lifestyle',
      icon: '🔍'
    },
    {
      number: '2', 
      title: 'Meet & Greet',
      description: 'Schedule a visit to meet your potential new family member',
      icon: '👋'
    },
    {
      number: '3',
      title: 'Apply',
      description: 'Fill out our simple adoption application form',
      icon: '📝'
    },
    {
      number: '4',
      title: 'Take Home',
      description: 'Complete the adoption and welcome your new companion home',
      icon: '🏠'
    }
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Adoption Process</h2>
          <p className="text-lg text-gray-600">We've made adopting your new best friend easy and straightforward</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-primary-200 transform -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10 bg-white rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-3xl">{step.icon}</span>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pets">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-500 transition-colors text-lg font-semibold">
                Start Your Adoption Journey
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
