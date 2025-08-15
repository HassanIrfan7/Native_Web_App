import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Video, Comment } from '../types';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Calendar,
  Tag,
  User,
  Send
} from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

export default function VideoPlayer({ video, onBack }: VideoPlayerProps) {
  const { user } = useAuth();
  const { comments, addComment, updateVideo } = useData();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);

  const videoComments = comments.filter(comment => comment.videoId === video.id);

  useEffect(() => {
    // Simulate view count increment
    updateVideo(video.id, { views: video.views + 1 });
  }, [video.id]);

  const handleLike = () => {
    const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
    setIsLiked(!isLiked);
    setLikesCount(newLikesCount);
    updateVideo(video.id, { likes: newLikesCount });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    addComment({
      videoId: video.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      content: newComment.trim()
    });

    setNewComment('');
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
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to videos</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-xl overflow-hidden mb-6">
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              {/* Simulated Video Player */}
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                </div>
                <p className="text-white text-lg font-medium">Video Player</p>
                <p className="text-gray-400 text-sm">
                  Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
            
            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-5 h-5" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{formatTimeAgo(video.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 mb-4">{video.description}</p>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Publisher</p>
                  <p className="text-white font-medium">{video.publisher}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Producer</p>
                  <p className="text-white font-medium">{video.producer}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Genre</p>
                  <p className="text-white font-medium">{video.genre}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Age Rating</p>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                    {video.ageRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {video.tags.map(tag => (
                  <span key={tag} className="flex items-center space-x-1 bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments ({videoComments.length})
            </h2>

            {/* Add Comment */}
            {user && (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {videoComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No comments yet</p>
                  <p className="text-gray-500 text-sm">Be the first to comment!</p>
                </div>
              ) : (
                videoComments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white text-sm">{comment.userName}</span>
                          <span className="text-gray-400 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}