import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, Share2, MessageCircle, Eye } from "lucide-react";
import { BACKEND_URL } from "../../config/index";
import { authApi } from "../../services/api.service";

interface VideoActionsProps {
  videoId: number;
  initialLikes?: number;
  views: number;
  commentCount: number;
}

const VideoActions: React.FC<VideoActionsProps> = ({
  videoId,
  initialLikes = 0,
  views,
  commentCount,
}) => {
  const { isAuthenticated, token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkLikeStatus();
    }
  }, [videoId, isAuthenticated]);

  const checkLikeStatus = async () => {
    if (!token) return;

    try {
      const { data } = await authApi.get(`/api/videos/${videoId}/like-status`);
      setLiked(data.liked);
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      alert("Please sign in to like videos");
      return;
    }

    try {
      const { data } = await authApi.post(`/api/videos/${videoId}/like`);
      setLiked(data.liked);
      setLikes(data.totalLikes);
    } catch (error: any) {
      console.error("Failed to toggle like:", error);
      alert(error.response?.data?.error || "Failed to toggle like");
    }
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = document.title;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else {
      // Generic share
      if (navigator.share) {
        navigator.share({
          title: title,
          url: url,
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    }
    setShowShareMenu(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Left side - Stats */}
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>{formatNumber(views)} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{formatNumber(commentCount)} comments</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            liked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          <span className="font-medium">{formatNumber(likes)}</span>
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share</span>
          </button>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default VideoActions;
