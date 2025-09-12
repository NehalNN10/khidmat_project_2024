import Link from 'next/link';

export const PetCategories = () => {
  const categories = [
    {
      name: 'Dogs',
      count: 47,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      link: '/browse?category=dogs',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Cats', 
      count: 32,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      link: '/browse?category=cats',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Birds',
      count: 15,
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop',
      link: '/browse?category=birds',
      bgColor: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      name: 'Small Pets',
      count: 23,
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
      link: '/browse?category=small-pets',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary-700 mb-1">Find Your Perfect Companion</h2>
          <div className="mx-auto w-64 h-1 bg-primary-700 mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our loving animals by category and find the perfect addition to your family
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.link}>
              <div className={`${category.bgColor} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}>
                <div className="aspect-w-16 aspect-h-12 mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:brightness-110 transition-all"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className={`${category.iconColor} font-medium`}>
                    {category.count} available
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};