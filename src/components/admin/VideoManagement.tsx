import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Edit, Trash2, Eye, Star, MessageCircle, Play, AlertCircle } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  description: string;
  filename: string;
  publisher: string;
  producer: string;
  genre: string;
  age_rating: string;
  views: number;
  average_rating: string;
  rating_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

const VideoManagement: React.FC = () => {
  const { token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    publisher: '',
    producer: '',
    genre: '',
    ageRating: ''
  });

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 
    'Thriller', 'Documentary', 'Animation', 'Adventure', 'Fantasy', 'Mystery'
  ];

  const ageRatings = ['G', 'PG', 'PG-13', 'R', '18+'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos/creator/my-videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || '',
      publisher: video.publisher,
      producer: video.producer,
      genre: video.genre,
      ageRating: video.age_rating
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const response = await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          publisher: editForm.publisher,
          producer: editForm.producer,
          genre: editForm.genre,
          ageRating: editForm.ageRating
        }),
      });

      if (response.ok) {
        await fetchVideos();
        setEditingVideo(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update video');
      }
    } catch (error) {
      console.error('Failed to update video:', error);
      alert('Failed to update video');
    }
  };

  const handleDelete = async (video: Video) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;

    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchVideos();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case 'G':
        return 'bg-green-900 text-green-200';
      case 'PG':
        return 'bg-yellow-900 text-yellow-200';
      case 'PG-13':
        return 'bg-orange-900 text-orange-200';
      case 'R':
      case '18+':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Video Management</h1>
        <p className="text-gray-400">Manage your uploaded videos</p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Play className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No videos yet</h3>
          <p className="text-gray-500">Upload your first video to get started!</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{video.title}</div>
                          <div className="text-sm text-gray-400">
                            {video.filename}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(video.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div><strong>Publisher:</strong> {video.publisher}</div>
                        <div><strong>Producer:</strong> {video.producer}</div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                            {video.genre}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getAgeRatingColor(video.age_rating)}`}>
                            {video.age_rating}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span>{video.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{video.average_rating} ({video.rating_count})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-blue-400" />
                          <span>{video.comment_count}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit video"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(video)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete video"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Edit Video</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={editForm.publisher}
                    onChange={(e) => setEditForm(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Producer
                  </label>
                  <input
                    type="text"
                    value={editForm.producer}
                    onChange={(e) => setEditForm(prev => ({ ...prev, producer: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Genre
                  </label>
                  <select
                    value={editForm.genre}
                    onChange={(e) => setEditForm(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Age Rating
                  </label>
                  <select
                    value={editForm.ageRating}
                    onChange={(e) => setEditForm(prev => ({ ...prev, ageRating: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ageRatings.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;