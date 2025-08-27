import React, { useState, useEffect } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import VideoGrid from '../components/dashboard/VideoGrid';
import Pagination from '../components/dashboard/Pagination';
import { BACKEND_URL } from '../config/index';

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

interface ApiResponse {
  videos: Video[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedAgeRating, setSelectedAgeRating] = useState('all');
  const [selectedPublisher, setSelectedPublisher] = useState('all');
  const [publishers, setPublishers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, selectedGenre, selectedAgeRating, selectedPublisher, currentPage]);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (searchQuery) params.set('search', searchQuery);
      if (selectedGenre !== 'all') params.set('genre', selectedGenre);
      if (selectedAgeRating !== 'all') params.set('ageRating', selectedAgeRating);
      if (selectedPublisher !== 'all') params.set('publisher', selectedPublisher);

      const response = await fetch(`${BACKEND_URL}/api/videos?${params}`);
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setVideos(data.videos);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/videos`);
      const data: ApiResponse = await response.json();

      if (response.ok) {
        const uniquePublishers = Array.from(
          new Set(data.videos.map(video => video.publisher))
        ).sort();
        setPublishers(uniquePublishers);
      }
    } catch (error) {
      console.error('Failed to fetch publishers:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedGenre, selectedAgeRating, selectedPublisher]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of high-quality videos from talented creators around the world.
            Find your next favorite content with advanced search and filtering options.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedAgeRating={selectedAgeRating}
          setSelectedAgeRating={setSelectedAgeRating}
          selectedPublisher={selectedPublisher}
          setSelectedPublisher={setSelectedPublisher}
          publishers={publishers}
        />

        {/* Results Info */}
        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * 12) + 1} to{' '}
              {Math.min(pagination.currentPage * 12, pagination.totalItems)} of{' '}
              {pagination.totalItems} videos
            </p>
          </div>
        )}

        {/* Video Grid */}
        <VideoGrid videos={videos} loading={loading} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.totalItems}
              itemsPerPage={12}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;