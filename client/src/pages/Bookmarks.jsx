import { BookmarkX, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Bookmarked Notes</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Quick access to all your saved academic resources and study materials
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading your saved bookmarks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center my-6">
          <p className="font-semibold mb-1">Failed to load bookmarks</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center my-6">
          <BookmarkX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No bookmarks saved yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You haven't bookmarked any study resources yet. Browse resources and click the bookmark button to save notes for quick review.
          </p>
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
