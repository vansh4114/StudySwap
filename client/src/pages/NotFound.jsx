import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <FileQuestion className="h-16 w-16 text-indigo-500 mb-4" />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
