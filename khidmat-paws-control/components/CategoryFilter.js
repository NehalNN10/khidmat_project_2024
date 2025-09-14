import { Filter } from 'lucide-react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter by:</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
              {category.count && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === category.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);
export default CategoryFilter;