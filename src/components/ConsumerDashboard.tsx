import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Video, SearchFilters } from '../types';
import { Search, Filter, Play, Eye, Heart, Clock, Flame, TrendingUp } from 'lucide-react';

interface ConsumerDashboardProps {
  onVideoSelect: (video: Video) => void;
}

export default function ConsumerDashboard({ onVideoSelect }: ConsumerDashboardProps) {
  const { videos } = useData();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    genre: '',
    ageRating: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const genres = ['Entertainment', 'Education', 'Music', 'Gaming', 'Sports', 'News', 'Comedy', 'Lifestyle', 'Dance', 'Cooking'];
  const ageRatings = ['G', 'PG', 'PG-13', 'R', '18+'];

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.filter(video => {
      const matchesQuery = searchFilters.query === '' || 
        video.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        video.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchFilters.query.toLowerCase()));
      
      const matchesGenre = searchFilters.genre === '' || video.genre === searchFilters.genre;
      const matchesAgeRating = searchFilters.ageRating === '' || video.ageRating === searchFilters.ageRating;
      
      return matchesQuery && matchesGenre && matchesAgeRating;
    });

    // Sort videos
    switch (searchFilters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [videos, searchFilters]);

  const trendingVideos = videos
    .filter(video => video.views > 10000)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Discover Videos</h1>
        <p className="text-gray-400">Explore amazing content from creators around the world</p>
      </div>

      {/* Trending Section */}
      {trendingVideos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-400" />
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => onVideoSelect(video)}
                className="relative bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
                    #{index + 1}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{video.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-400 mt-2">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatViews(video.likes)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos, creators, or tags..."
              value={searchFilters.query}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 border border-gray-700 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              showFilters ? 'bg-purple-500 text-white border-purple-500' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <select
                  value={searchFilters.genre}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, genre: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age Rating</label>
                <select
                  value={searchFilters.ageRating}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, ageRating: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="">All Ratings</option>
                  {ageRatings.map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Liked</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400">
          {filteredAndSortedVideos.length} video{filteredAndSortedVideos.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Videos Grid */}
      {filteredAndSortedVideos.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedVideos.map(video => (
            <div
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatViews(video.likes)}</span>
                    </div>
                  </div>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                    {video.ageRating}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-700 px-2 py-1 rounded">{video.genre}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}