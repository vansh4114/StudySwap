import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileX,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import ResourceCard from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import { getResources } from '../services/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    q: '',
    resourceType: '',
    subject: '',
    semester: '',
    course: '',
    university: '',
    page: 1,
    limit: 9
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    count: 0
  });

  const fetchResourcesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.q) queryParams.append('q', filters.q);
      if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.semester) queryParams.append('semester', filters.semester);
      if (filters.course) queryParams.append('course', filters.course);
      if (filters.university) queryParams.append('university', filters.university);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);

      const res = await getResources(queryParams.toString());
      if (res.success) {
        setResources(res.resources || []);
        setPagination({
          total: res.total || 0,
          totalPages: res.totalPages || 1,
          count: res.count || 0
        });
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to load study resources');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResourcesData();
  }, [fetchResourcesData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page on filter change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      resourceType: '',
      subject: '',
      semester: '',
      course: '',
      university: '',
      page: 1,
      limit: 9
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      const discoverElement = document.getElementById('discover-section');
      if (discoverElement) {
        discoverElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToDiscover = () => {
    const discoverElement = document.getElementById('discover-section');
    if (discoverElement) {
      discoverElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeFilterCount = [
    filters.q,
    filters.resourceType,
    filters.subject,
    filters.semester,
    filters.course,
    filters.university
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-20 mb-12 text-center flex flex-col items-center justify-center">
        {/* Ambient Lime Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DFFF00]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Eyebrow Label */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DFFF00]/10 border border-[#DFFF00]/25 text-[#DFFF00] text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Student Knowledge Network</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F5] leading-[1.08] max-w-4xl mb-6">
          Find notes you <br className="hidden sm:inline" />
          <span className="text-[#DFFF00] relative inline-block">
            actually need
            <span className="absolute bottom-1 left-0 w-full h-1 bg-[#DFFF00]/30 rounded-full"></span>
          </span>
          .
        </h1>

        {/* Supporting Subheading */}
        <p className="text-base sm:text-lg text-[#A5A8AA] max-w-2xl mb-8 leading-relaxed font-normal">
          Discover, share, and exchange verified lecture notes, previous year question papers, and study materials uploaded by students across courses.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={scrollToDiscover}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DFFF00] text-[#050708] font-extrabold text-sm hover:bg-[#CFFF00] transition-all shadow-[0_0_25px_rgba(223,255,0,0.2)] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Browse Resources</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {isAuthenticated ? (
            <Link
              to="/upload"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#101416] text-[#F5F5F5] border border-white/10 font-semibold text-sm hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
            >
              <FilePlus className="h-4 w-4 text-[#DFFF00]" />
              <span>Upload Notes (+10 pts)</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#101416] text-[#F5F5F5] border border-white/10 font-semibold text-sm hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
            >
              <span>Join StudySwap Free</span>
            </Link>
          )}
        </div>

        {/* Hero Badges / Features Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="bg-[#101416]/50 border border-white/5 p-3 rounded-xl flex items-center justify-center space-x-2 text-xs text-[#A5A8AA]">
            <Zap className="h-4 w-4 text-[#DFFF00]" />
            <span>Direct PDF Access</span>
          </div>
          <div className="bg-[#101416]/50 border border-white/5 p-3 rounded-xl flex items-center justify-center space-x-2 text-xs text-[#A5A8AA]">
            <BookOpen className="h-4 w-4 text-[#DFFF00]" />
            <span>Course & Sem Filtered</span>
          </div>
          <div className="bg-[#101416]/50 border border-white/5 p-3 rounded-xl flex items-center justify-center space-x-2 text-xs text-[#A5A8AA]">
            <Sparkles className="h-4 w-4 text-[#DFFF00]" />
            <span>Peer Ratings & Points</span>
          </div>
        </div>
      </section>

      {/* RESOURCE DISCOVERY SECTION */}
      <section id="discover-section" className="scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-bold text-[#DFFF00] uppercase tracking-widest block mb-1">
              DISCOVER RESOURCES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5]">
              Academic Library
            </h2>
          </div>
          {!loading && !error && (
            <p className="text-xs text-[#A5A8AA]">
              Showing <span className="text-[#F5F5F5] font-semibold">{pagination.total}</span> total resources
              {activeFilterCount > 0 && ` (${activeFilterCount} active filters)`}
            </p>
          )}
        </div>

        {/* Search & Filter Component */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          /* ERROR STATE */
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#F5F5F5] p-8 rounded-2xl text-center my-6 max-w-2xl mx-auto">
            <AlertCircle className="h-10 w-10 text-[#FF5C5C] mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Unable to Load Resources</h3>
            <p className="text-xs text-[#A5A8AA] mb-5">{error}</p>
            <button
              onClick={fetchResourcesData}
              className="px-5 py-2.5 bg-[#FF5C5C] text-[#050708] text-xs font-bold rounded-xl hover:bg-[#FF5C5C]/90 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : resources.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-[#101416] border border-white/10 rounded-2xl p-12 text-center my-6 max-w-2xl mx-auto">
            <FileX className="h-12 w-12 text-[#72777A] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#F5F5F5] mb-1">No resources found</h3>
            <p className="text-xs text-[#A5A8AA] max-w-md mx-auto mb-6">
              We couldn't find any study resources matching your search or filters. Try clearing filters or using different keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#DFFF00] text-[#050708] text-xs font-bold rounded-full hover:bg-[#CFFF00] transition-colors cursor-pointer shadow-[0_0_15px_rgba(223,255,0,0.15)]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* RESOURCES GRID */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 gap-4">
                <div className="text-xs text-[#A5A8AA]">
                  Showing <span className="font-bold text-[#F5F5F5]">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                  <span className="font-bold text-[#F5F5F5]">
                    {Math.min(filters.page * filters.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-bold text-[#F5F5F5]">{pagination.total}</span> resources
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2.5 rounded-xl border border-white/10 bg-[#101416] text-[#F5F5F5] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00]"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-xs font-semibold text-[#F5F5F5] px-3">
                    Page {filters.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="p-2.5 rounded-xl border border-white/10 bg-[#101416] text-[#F5F5F5] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00]"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
