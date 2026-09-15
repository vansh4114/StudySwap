import { ChevronLeft, ChevronRight, FileX, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import FilterPanel from '../components/FilterPanel';
import ResourceCard from '../components/ResourceCard';
import { getResources } from '../services/api';

const Home = () => {
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Title Banner */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Exchange & Discover Academic Notes
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Browse verified study notes, previous year papers, assignments, and reference materials uploaded by students.
        </p>
      </div>

      {/* Filter Component */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading resources...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center my-6">
          <p className="font-semibold text-base mb-2">Oops! Something went wrong</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchResourcesData}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : resources.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center my-6">
          <FileX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No resources found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
            We couldn't find any study resources matching your search or filters. Try adjusting your search query or reset filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        /* Resources Grid */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                Showing <span className="font-semibold">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(filters.page * filters.limit, pagination.total)}
                </span>{' '}
                of <span className="font-semibold">{pagination.total}</span> resources
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="text-sm font-medium text-gray-700 px-3">
                  Page {filters.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
