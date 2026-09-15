import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Flag,
  GraduationCap,
  Loader2,
  Star,
  Trash2,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import {
  bookmarkResource,
  deleteRating,
  deleteResource,
  downloadResource,
  getResourceById,
  getUserBookmarks,
  rateResource,
  removeBookmark,
  reportResource
} from '../services/api';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getResourceById(id);
        if (res.success && res.resource) {
          setResource(res.resource);
        }

        // Check bookmark status if authenticated
        if (isAuthenticated) {
          try {
            const bRes = await getUserBookmarks();
            if (bRes.success && bRes.bookmarks) {
              const bookmarked = bRes.bookmarks.some(
                (b) => b.resource && (b.resource._id === id || b.resource === id)
              );
              setIsBookmarked(bookmarked);
            }
          } catch (bErr) {
            console.error('Failed to check bookmark state:', bErr);
          }
        }
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError(err.message || 'Resource not found');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, isAuthenticated]);

  const showFeedback = (msg, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // Download Handler
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await downloadResource(id);
      if (res.success && res.downloadUrl) {
        setResource((prev) => ({
          ...prev,
          downloadCount: (prev.downloadCount || 0) + 1
        }));
        window.open(res.downloadUrl, '_blank');
        showFeedback('Download started successfully!');
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to download file', true);
    } finally {
      setDownloading(false);
    }
  };

  // Bookmark Toggle Handler
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
        showFeedback('Removed from bookmarks');
      } else {
        await bookmarkResource(id);
        setIsBookmarked(true);
        showFeedback('Added to bookmarks');
      }
    } catch (err) {
      showFeedback(err.message || 'Bookmark action failed', true);
    }
  };

  // Rating Submit Handler
  const handleRate = async (newRating) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingRating(true);
    try {
      if (userRating === newRating) {
        // Delete rating if clicking same star
        const res = await deleteRating(id);
        setUserRating(0);
        if (res.success) {
          setResource((prev) => ({ ...prev, averageRating: res.averageRating }));
          showFeedback('Rating removed');
        }
      } else {
        const res = await rateResource(id, newRating);
        setUserRating(newRating);
        if (res.success) {
          setResource((prev) => ({ ...prev, averageRating: res.averageRating }));
          showFeedback(`Rated ${newRating} stars!`);
        }
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to submit rating', true);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Report Submit Handler
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setSubmittingReport(true);
    try {
      const res = await reportResource(id, reportReason.trim());
      if (res.success) {
        showFeedback('Report submitted to moderation');
        setIsReportModalOpen(false);
        setReportReason('');
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to submit report', true);
    } finally {
      setSubmittingReport(false);
    }
  };

  // Delete Resource Handler (Owner/Admin)
  const handleDeleteResource = async () => {
    try {
      const res = await deleteResource(id);
      if (res.success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to delete resource', true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-xl mb-6">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
          <p className="text-sm text-red-600 mb-4">{error || 'The requested study resource could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    user &&
    resource.uploadedBy &&
    (user._id === resource.uploadedBy._id || user._id === resource.uploadedBy || user.role === 'ADMIN');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Resources</span>
      </Link>

      {/* Feedback Banners */}
      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {/* Header section */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {resource.resourceType}
              </span>
              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
                Semester {resource.semester} • {resource.course}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{resource.title}</h1>
            <p className="text-sm font-semibold text-indigo-600">{resource.subject}</p>
          </div>

          {/* Action buttons (Bookmark & Delete) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmarkToggle}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              <span className="text-xs font-semibold">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer flex items-center space-x-1"
                title="Delete Resource"
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-xs font-semibold">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100 mb-6 bg-gray-50/50 rounded-xl px-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <div>
              <p className="text-xs text-gray-500">Average Rating</p>
              <p className="text-sm font-bold">
                {resource.averageRating > 0 ? `${resource.averageRating.toFixed(1)} / 5.0` : 'No ratings'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <Eye className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Total Views</p>
              <p className="text-sm font-bold">{resource.viewCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <Download className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Downloads</p>
              <p className="text-sm font-bold">{resource.downloadCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">File Info</p>
              <p className="text-sm font-bold uppercase">{resource.fileType || 'Doc'}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">University / Institution:</span>{' '}
            <span className="font-semibold text-gray-800">{resource.university || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-gray-500">Uploaded By:</span>{' '}
            <span className="font-semibold text-gray-800">
              {resource.uploadedBy?.name || 'Student'} ({resource.uploadedBy?.college || 'College'})
            </span>
          </div>
          <div>
            <span className="text-gray-500">File Name:</span>{' '}
            <span className="font-medium text-gray-800 truncate">{resource.fileName}</span>
          </div>
          <div>
            <span className="text-gray-500">Uploaded On:</span>{' '}
            <span className="font-medium text-gray-800">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">TAGS</h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Preparing Download...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Resource</span>
              </>
            )}
          </button>

          {/* Interactive Rating Component */}
          <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <span className="text-xs font-semibold text-gray-600">Rate this note:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  disabled={submittingRating}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= (userRating || Math.round(resource.averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Report Link */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs text-gray-400 hover:text-red-600 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Flag className="h-3.5 w-3.5" />
            <span>Report inappropriate content</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteResource}
        title="Delete Resource?"
        message="Are you sure you want to delete this resource? This will permanently remove the file from Cloudinary and database records."
        confirmText="Delete Resource"
        isDanger={true}
      />

      {/* Report Modal */}
      <ConfirmModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Resource"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for report *
            </label>
            <textarea
              rows={4}
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe why this resource is inappropriate, incorrect, or violating copyright..."
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={submittingReport || !reportReason.trim()}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submittingReport ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </ConfirmModal>
    </div>
  );
};

export default ResourceDetails;
