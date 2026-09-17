import { RotateCcw, Search } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-[#101416] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl mb-8">
      {/* Search Input Bar */}
      <div className="relative mb-5">
        <label htmlFor="search-input" className="sr-only">
          Search resources
        </label>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#72777A]">
          <Search className="h-5 w-5" />
        </div>
        <input
          id="search-input"
          type="text"
          name="q"
          value={filters.q || ''}
          onChange={(e) => onFilterChange('q', e.target.value)}
          placeholder="Search by title, subject, tags, or course..."
          className="w-full pl-11 pr-4 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resource Type */}
        <div>
          <label htmlFor="filter-type" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
            Resource Type
          </label>
          <select
            id="filter-type"
            value={filters.resourceType || ''}
            onChange={(e) => onFilterChange('resourceType', e.target.value)}
            className="w-full bg-[#151A1D] border border-white/10 text-[#F5F5F5] text-xs rounded-xl p-3 focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none font-medium transition-all"
          >
            <option value="" className="bg-[#101416] text-[#A5A8AA]">All Types</option>
            <option value="NOTES" className="bg-[#101416]">Notes</option>
            <option value="PYQ" className="bg-[#101416]">PYQ (Previous Papers)</option>
            <option value="ASSIGNMENT" className="bg-[#101416]">Assignments</option>
            <option value="BOOK" className="bg-[#101416]">Books / Reference</option>
            <option value="OTHER" className="bg-[#101416]">Other</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label htmlFor="filter-semester" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
            Semester
          </label>
          <select
            id="filter-semester"
            value={filters.semester || ''}
            onChange={(e) => onFilterChange('semester', e.target.value)}
            className="w-full bg-[#151A1D] border border-white/10 text-[#F5F5F5] text-xs rounded-xl p-3 focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none font-medium transition-all"
          >
            <option value="" className="bg-[#101416] text-[#A5A8AA]">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num} className="bg-[#101416]">
                Semester {num}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="filter-subject" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
            Subject
          </label>
          <input
            id="filter-subject"
            type="text"
            value={filters.subject || ''}
            onChange={(e) => onFilterChange('subject', e.target.value)}
            placeholder="e.g. Data Structures"
            className="w-full bg-[#151A1D] border border-white/10 text-[#F5F5F5] placeholder:text-[#72777A] text-xs rounded-xl p-3 focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none font-medium transition-all"
          />
        </div>

        {/* Course */}
        <div>
          <label htmlFor="filter-course" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
            Course / Branch
          </label>
          <input
            id="filter-course"
            type="text"
            value={filters.course || ''}
            onChange={(e) => onFilterChange('course', e.target.value)}
            placeholder="e.g. B.Tech CS"
            className="w-full bg-[#151A1D] border border-white/10 text-[#F5F5F5] placeholder:text-[#72777A] text-xs rounded-xl p-3 focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none font-medium transition-all"
          />
        </div>
      </div>

      {/* Filter Reset Footer */}
      <div className="flex justify-end mt-4 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs text-[#A5A8AA] hover:text-[#DFFF00] font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
