import { ArrowRight, BookmarkX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard';
import { getUserBookmarks } from '../services/api';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserBookmarks();
        if (res.success && res.bookmarks) {
          setBookmarks(res.bookmarks);
        }
      } catch (err) {
        console.error('Error loading bookmarks:', err);
        setError(err.message || 'Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-[#DFFF00] uppercase tracking-widest block mb-1">
          PERSONAL COLLECTION
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
          Your Library
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A8AA] mt-1.5">
          Quick access to all your saved academic resources and study materials
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#101416] border border-white/10 rounded-2xl h-64 p-5 animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-16 bg-white/10 rounded-full"></div>
                  <div className="h-4 w-24 bg-white/5 rounded-md"></div>
                </div>
                <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-white/5 rounded mb-4"></div>
                <div className="h-12 w-full bg-white/5 rounded"></div>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <div className="h-4 w-20 bg-white/5 rounded"></div>
                <div className="h-4 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#F5F5F5] p-8 rounded-2xl text-center my-6 max-w-xl mx-auto">
          <p className="font-bold mb-1 text-[#FF5C5C]">Failed to load bookmarks</p>
          <p className="text-xs text-[#A5A8AA]">{error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-[#101416] border border-white/10 rounded-2xl p-12 text-center my-6 max-w-xl mx-auto shadow-2xl">
          <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto mb-4 border border-white/5">
            <BookmarkX className="h-8 w-8 text-[#72777A]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#F5F5F5] mb-1 tracking-tight">Your Library is Empty</h2>
          <p className="text-xs text-[#A5A8AA] max-w-md mx-auto mb-6 leading-relaxed">
            Save resources while browsing academic notes and they will automatically appear here for quick access.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#DFFF00] text-[#050708] text-xs font-extrabold rounded-full hover:bg-[#CFFF00] transition-colors shadow-[0_0_15px_rgba(223,255,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
          >
            <span>Browse Resources</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <ResourceCard key={b.bookmarkId} resource={b.resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
