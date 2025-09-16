// components/LoadingSpinner.js
import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex items-center gap-3 text-gray-600">
      <Loader className="w-6 h-6 animate-spin" />
      <span className="text-lg">Loading pets...</span>
    </div>
  </div>
);

export default LoadingSpinner;