import { Download, Eye, FileText, Star, User } from 'lucide-react';
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

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'NOTES':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PYQ':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ASSIGNMENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BOOK':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getTypeBadgeColor(
              resourceType
            )}`}
          >
            {resourceType}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            Sem {semester} • {course}
          </span>
        </div>

        {/* Title & Subject */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 hover:text-indigo-600 transition-colors">
          <Link to={`/resources/${_id}`}>{title}</Link>
        </h3>
        <p className="text-xs font-semibold text-indigo-600 mb-2">{subject}</p>

        {/* Description Snippet */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1 text-gray-600">
          <User className="h-3.5 w-3.5" />
          <span className="truncate max-w-[100px]">
            {uploadedBy?.name || 'Anonymous'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-amber-500 font-medium">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{viewCount}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Download className="h-3.5 w-3.5" />
            <span>{downloadCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
