import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Star, MessageCircle, Clock } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  description: string;
  filename: string;
  publisher: string;
  producer: string;
  genre: string;
  age_rating: string;
  creator_name: string;
  views: number;
  average_rating: string;
  rating_count: number;
  comment_count: number;
  created_at: string;
}

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <Play className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case 'G':
        return 'bg-green-100 text-green-800';
      case 'PG':
        return 'bg-yellow-100 text-yellow-800';
      case 'PG-13':
        return 'bg-orange-100 text-orange-800';
      case 'R':
      case '18+':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <Link
          key={video.id}
          to={`/video/${video.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
        >
          {/* Video Thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 group-hover:bg-opacity-30 transition-all duration-200">
              <Play className="h-8 w-8 text-white" />
            </div>
            
            {/* Age Rating Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getAgeRatingColor(video.age_rating)}`}>
              {video.age_rating}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {video.title}
            </h3>
            
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{video.publisher}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {video.genre}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                by {video.creator_name} • {formatDate(video.created_at)}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{video.average_rating} ({video.rating_count})</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{video.comment_count}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VideoGrid;