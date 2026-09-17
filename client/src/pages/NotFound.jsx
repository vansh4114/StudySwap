import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 text-center relative">
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
        <FileQuestion className="h-12 w-12 text-[#DFFF00]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] mb-2 tracking-tight">404 - Page Not Found</h1>
      <p className="text-[#A5A8AA] max-w-md mx-auto mb-6 text-xs sm:text-sm leading-relaxed">
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-[#DFFF00] text-[#050708] font-extrabold text-xs rounded-full hover:bg-[#CFFF00] transition-all shadow-[0_0_20px_rgba(223,255,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
