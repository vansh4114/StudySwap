import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Flag,
  Loader2,
  Star,
  Trash2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  // Guard against duplicate resource fetches for the same ID
  const fetchedIdRef = useRef(null);

  useEffect(() => {
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;

    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getResourceById(id);
        if (res.success && res.resource) {
          setResource(res.resource);
        }
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError(err.message || 'Resource not found');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  // Check bookmark status separately when authenticated without re-fetching resource
  useEffect(() => {
    const checkBookmark = async () => {
      if (isAuthenticated && id) {
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
    };

    checkBookmark();
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

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'NOTES':
        return 'bg-[#DFFF00]/10 text-[#DFFF00] border-[#DFFF00]/30';
      case 'PYQ':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'ASSIGNMENT':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'BOOK':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-white/5 text-[#A5A8AA] border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#101416] border border-white/10 rounded-2xl p-8 animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 bg-white/10 rounded-full"></div>
            <div className="h-8 w-28 bg-white/5 rounded-xl"></div>
          </div>
          <div className="h-8 w-3/4 bg-white/10 rounded-lg"></div>
          <div className="h-4 w-1/3 bg-white/5 rounded"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
            ))}
          </div>
          <div className="h-24 w-full bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#F5F5F5] p-8 rounded-2xl my-6">
          <AlertCircle className="h-10 w-10 text-[#FF5C5C] mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
          <p className="text-xs text-[#A5A8AA] mb-6">{error || 'The requested study resource could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#DFFF00] text-[#050708] font-bold text-xs rounded-full hover:bg-[#CFFF00] transition-colors shadow-[0_0_15px_rgba(223,255,0,0.15)]"
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
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[#A5A8AA] hover:text-[#F5F5F5] bg-[#101416] border border-white/10 px-3.5 py-1.5 rounded-full mb-6 transition-all hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Browse</span>
      </Link>

      {/* Feedback Banners */}
      {actionSuccess && (
        <div className="bg-[#B8FF4D]/10 border border-[#B8FF4D]/30 text-[#B8FF4D] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-[#B8FF4D] shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-[#FF5C5C] shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 relative">
        {/* Header section */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-bold tracking-wider px-3 py-0.5 rounded-full border uppercase ${getTypeBadgeStyle(
                  resource.resourceType
                )}`}
              >
                {resource.resourceType}
              </span>
              <span className="text-[11px] font-medium text-[#A5A8AA] bg-[#151A1D] px-3 py-0.5 rounded-md border border-white/5">
                Semester {resource.semester} • {resource.course}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight leading-tight break-words">
              {resource.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#A5A8AA] flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#DFFF00]"></span>
              <span>{resource.subject}</span>
            </p>
          </div>

          {/* Action buttons (Bookmark & Delete) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmarkToggle}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
                isBookmarked
                  ? 'bg-[#DFFF00]/10 border-[#DFFF00]/30 text-[#DFFF00]'
                  : 'bg-[#151A1D] border-white/10 text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#DFFF00]' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-[#FF5C5C]/25 bg-[#FF5C5C]/10 text-[#FF5C5C] hover:bg-[#FF5C5C]/20 transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C5C]"
                title="Delete Resource"
                aria-label="Delete Resource"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10 mb-6 bg-[#151A1D]/60 rounded-xl px-5 border border-white/5">
          <div className="flex items-center space-x-3 text-[#F5F5F5]">
            <div className="p-2 rounded-lg bg-[#DFFF00]/10 text-[#DFFF00]">
              <Star className="h-4 w-4 fill-[#DFFF00]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Average Rating</p>
              <p className="text-sm font-extrabold text-[#F5F5F5]">
                {resource.averageRating > 0 ? `${resource.averageRating.toFixed(1)} / 5.0` : 'New'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[#F5F5F5]">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Total Views</p>
              <p className="text-sm font-extrabold text-[#F5F5F5]">{resource.viewCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[#F5F5F5]">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Downloads</p>
              <p className="text-sm font-extrabold text-[#F5F5F5]">{resource.downloadCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[#F5F5F5]">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">File Info</p>
              <p className="text-sm font-extrabold uppercase text-[#F5F5F5]">{resource.fileType || 'Doc'}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#A5A8AA] uppercase tracking-wider mb-2">Description</h3>
          <p className="text-xs sm:text-sm text-[#F5F5F5] whitespace-pre-line leading-relaxed bg-[#151A1D] p-4 rounded-xl border border-white/5">
            {resource.description || 'No detailed description provided for this academic resource.'}
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-[#151A1D]/40 p-4 rounded-xl border border-white/5 text-xs">
          <div>
            <span className="text-[#72777A]">University / Institution:</span>{' '}
            <span className="font-semibold text-[#F5F5F5]">{resource.university || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-[#72777A]">Uploaded By:</span>{' '}
            <span className="font-semibold text-[#F5F5F5]">
              {resource.uploadedBy?.name || 'Student'} ({resource.uploadedBy?.college || 'College'})
            </span>
          </div>
          <div>
            <span className="text-[#72777A]">File Name:</span>{' '}
            <span className="font-mono text-[#A5A8AA] truncate block sm:inline">{resource.fileName}</span>
          </div>
          <div>
            <span className="text-[#72777A]">Uploaded On:</span>{' '}
            <span className="font-semibold text-[#F5F5F5]">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider mb-2">TAGS</h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-[#151A1D] text-[#A5A8AA] px-2.5 py-1 rounded-md font-medium border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Download Button & Interactive Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#DFFF00] text-[#050708] font-extrabold text-sm rounded-full hover:bg-[#CFFF00] disabled:opacity-50 transition-all shadow-[0_0_25px_rgba(223,255,0,0.2)] flex items-center justify-center space-x-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
            aria-label="Download Resource"
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
          <div className="flex items-center space-x-3 bg-[#151A1D] px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-[#A5A8AA]">Rate note:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  disabled={submittingRating}
                  aria-label={`Rate ${star} out of 5 stars`}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00] rounded"
                >
                  <Star
                    className={`h-4 w-4 ${
                      star <= (userRating || Math.round(resource.averageRating))
                        ? 'fill-[#DFFF00] text-[#DFFF00]'
                        : 'text-[#72777A]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Report Link */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs text-[#72777A] hover:text-[#FF5C5C] flex items-center space-x-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5C5C] p-1 rounded"
            aria-label="Report inappropriate content"
          >
            <Flag className="h-3.5 w-3.5" />
            <span>Report issue</span>
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
            <label htmlFor="report-reason-input" className="block text-xs font-semibold text-[#A5A8AA] mb-1.5 uppercase tracking-wider">
              Reason for report *
            </label>
            <textarea
              id="report-reason-input"
              rows={4}
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe why this resource is inappropriate, incorrect, or violating terms..."
              className="w-full p-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={submittingReport || !reportReason.trim()}
              className="px-4 py-2 bg-[#FF5C5C] text-[#050708] text-xs font-bold rounded-xl hover:bg-[#FF5C5C]/90 disabled:opacity-50 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,92,92,0.2)]"
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
