import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Play,
  Eye,
  Calendar,
  User,
  Building,
  Film,
  Star,
  MessageCircle,
} from "lucide-react";
import CommentSection from "./CommentSection";
import RatingSection from "./RatingSection";
import VideoActions from "./VideoActions";
import { BACKEND_URL } from "../../config/index";
import { publicApi } from "../../services/api.service";

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

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data } = await publicApi.get(`/api/videos/${id}`);
      setVideo(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "G":
        return "bg-green-100 text-green-800 border-green-200";
      case "PG":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PG-13":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "R":
      case "18+":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="h-96 bg-gray-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Play className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Video
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Play className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Video Not Found
          </h3>
          <p className="text-gray-500">
            The video you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Player */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
          {/* Actual Video Display */}
          <div className="relative bg-black">
            <video
              key={video.id}
              controls
              autoPlay
              crossOrigin="anonymous"
              className="w-full h-96 object-contain bg-black"
            >
              <source
                src={`${BACKEND_URL}/uploads/${video.filename}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Age Rating Badge */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border ${getAgeRatingColor(
                video.age_rating
              )}`}
            >
              {video.age_rating}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {video.title}
                </h1>

                {video.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {video.description}
                  </p>
                )}

                {/* Video Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>
                      {video.average_rating} ({video.rating_count} ratings)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{video.comment_count} comments</span>
                  </div>
                </div>

                {/* Video Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>Publisher:</strong> {video.publisher}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Film className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>Producer:</strong> {video.producer}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>Creator:</strong> {video.creator_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        <strong>Genre:</strong>
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {video.genre}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              {token && <RatingSection videoId={video.id} />}
            </div>

            {/* Video Actions */}
            <VideoActions
              videoId={video.id}
              views={video.views}
              commentCount={video.comment_count}
            />
          </div>
        </div>

        {/* Comments Section */}
        {token && <CommentSection videoId={video.id} />}
      </div>
    </div>
  );
};

export default VideoPlayer;
