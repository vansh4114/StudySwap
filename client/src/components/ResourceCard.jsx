import { Download, Eye, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
  const {
    _id,
    title,
    description,
    resourceType,
    subject,
    semester,
    course,
    uploadedBy,
    averageRating,
    viewCount,
    downloadCount,
    tags
  } = resource;

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

  return (
    <div className="bg-[#101416] rounded-2xl border border-white/10 p-5 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-black/40 relative">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border uppercase ${getTypeBadgeStyle(
              resourceType
            )}`}
          >
            {resourceType}
          </span>
          <span className="text-[11px] font-medium text-[#A5A8AA] bg-[#151A1D] px-2.5 py-0.5 rounded-md border border-white/5 truncate max-w-[150px]">
            Sem {semester} • {course}
          </span>
        </div>

        {/* Title & Subject */}
        <h3 className="text-base sm:text-lg font-bold text-[#F5F5F5] group-hover:text-[#DFFF00] transition-colors line-clamp-1 mb-1">
          <Link to={`/resources/${_id}`} className="focus:outline-none focus:underline">
            {title}
          </Link>
        </h3>
        <p className="text-xs font-semibold text-[#A5A8AA] tracking-wide mb-2 flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DFFF00]"></span>
          <span>{subject}</span>
        </p>

        {/* Description Snippet */}
        <p className="text-xs text-[#72777A] line-clamp-2 mb-4 leading-relaxed">
          {description || 'No detailed description provided for this academic resource.'}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-[#A5A8AA] bg-[#151A1D] px-2 py-0.5 rounded border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="border-t border-white/10 pt-3.5 mt-2 flex items-center justify-between text-xs text-[#A5A8AA]">
        <div className="flex items-center space-x-1.5 text-[#A5A8AA]">
          <User className="h-3.5 w-3.5 text-[#72777A]" />
          <span className="truncate max-w-[100px] text-xs">
            {uploadedBy?.name || 'Student'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-[#DFFF00] font-bold text-xs">
            <Star className="h-3.5 w-3.5 fill-[#DFFF00] text-[#DFFF00]" />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
          </div>

          <div className="flex items-center space-x-1 text-[#72777A]">
            <Eye className="h-3.5 w-3.5" />
            <span>{viewCount}</span>
          </div>

          <div className="flex items-center space-x-1 text-[#72777A]">
            <Download className="h-3.5 w-3.5" />
            <span>{downloadCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
