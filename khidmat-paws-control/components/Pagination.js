// components/Pagination.js
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, hasNext, hasPrev, onPageChange }) => {
  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end page numbers
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Generate visible page numbers
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push('...');
      }
    } else if (start === 2) {
      rangeWithDots.push(1);
    }

    // Add main range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    } else if (end === totalPages - 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hasPrev
            ? 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            : 'text-gray-400 cursor-not-allowed border border-gray-200'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-primary-600 text-white shadow-md'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hasNext
            ? 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            : 'text-gray-400 cursor-not-allowed border border-gray-200'
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;