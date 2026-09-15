import { Filter, RotateCcw, Search } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs mb-6">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          name="q"
          value={filters.q || ''}
          onChange={(e) => onFilterChange('q', e.target.value)}
          placeholder="Search by title, subject, tags, description..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all text-sm"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Resource Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Resource Type
          </label>
          <select
            value={filters.resourceType || ''}
            onChange={(e) => onFilterChange('resourceType', e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="NOTES">Notes</option>
            <option value="PYQ">PYQ (Previous Papers)</option>
            <option value="ASSIGNMENT">Assignments</option>
            <option value="BOOK">Books</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Semester
          </label>
          <select
            value={filters.semester || ''}
            onChange={(e) => onFilterChange('semester', e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                Semester {num}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={filters.subject || ''}
            onChange={(e) => onFilterChange('subject', e.target.value)}
            placeholder="e.g. Data Structures"
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Course / Branch
          </label>
          <input
            type="text"
            value={filters.course || ''}
            onChange={(e) => onFilterChange('course', e.target.value)}
            placeholder="e.g. B.Tech CS"
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Reset */}
      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1 px-2 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
