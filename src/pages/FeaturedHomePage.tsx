import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Star, MessageCircle, TrendingUp, Award, Users, ArrowRight, Heart, Share2 } from 'lucide-react';

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

const FeaturedHomePage: React.FC = () => {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      console.log('Fetching featured content...');
      const response = await fetch('/api/videos?limit=8');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const data = await response.json();

      if (data.videos) {
        const videos = data.videos || [];
        setFeaturedVideos(videos.slice(0, 4));
        setTrendingVideos(videos.slice(4, 8));
        console.log('Featured content loaded successfully');
      } else {
        console.warn('No videos found in response');
        setFeaturedVideos([]);
        setTrendingVideos([]);
      }
    } catch (error) {
      console.error('Failed to fetch featured content:', error);
      // Set empty arrays to prevent UI errors
      setFeaturedVideos([]);
      setTrendingVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
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

  const VideoCard: React.FC<{ video: Video; featured?: boolean }> = ({ video, featured = false }) => (
    <div className={`group relative ${featured ? 'col-span-2' : ''}`}>
      <Link to={`/video/${video.id}`} className="block">
        <div className={`relative overflow-hidden rounded-xl ${featured ? 'h-80' : 'h-64'} bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600`}>
          {/* Video Thumbnail Placeholder */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 group-hover:bg-opacity-30 transition-all duration-300 group-hover:scale-110">
              <Play className={`${featured ? 'h-12 w-12' : 'h-8 w-8'} text-white`} />
            </div>
          </div>
          
          {/* Age Rating Badge */}
          <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${getAgeRatingColor(video.age_rating)}`}>
            {video.age_rating}
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Award className="h-3 w-3" />
              <span>FEATURED</span>
            </div>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{video.average_rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Video Info */}
      <div className="mt-4">
        <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${featured ? 'text-xl' : 'text-lg'} line-clamp-2`}>
          {video.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm text-gray-600 font-medium">{video.publisher}</p>
            <p className="text-xs text-gray-500">by {video.creator_name}</p>
          </div>
          <div className="text-right">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {video.genre}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{formatViews(video.views)} views</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{video.comment_count}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-300 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-48 bg-gray-300 rounded-xl"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing Content
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join millions of creators and viewers sharing stories, experiences, and creativity on AzureStream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join Community</span>
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Explore Videos</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">50M+</div>
              <div className="text-gray-600">Video Views</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">2M+</div>
              <div className="text-gray-600">Comments</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">120+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Content</h2>
            <p className="text-gray-600">Hand-picked videos from our top creators</p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} featured={index === 0} />
          ))}
        </div>

        {/* Trending Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-600">What's popular right now</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their passion with the world.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 text-lg"
          >
            <Users className="h-6 w-6" />
            <span>Get Started Today</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedHomePage;
