import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Star } from "lucide-react";
import { BACKEND_URL } from "../../config/index";
import { authApi } from "../../services/api.service";

interface RatingSectionProps {
  videoId: number;
}

const RatingSection: React.FC<RatingSectionProps> = ({ videoId }) => {
  const { token } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserRating();
  }, [videoId]);

  const fetchUserRating = async () => {
    if (!token) return;

    try {
      const { data } = await authApi.get(`/api/ratings/video/${videoId}/user`);
      setUserRating(data.rating);
    } catch (error) {
      console.error("Failed to fetch user rating:", error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!token || submitting) return;

    setSubmitting(true);
    try {
      await authApi.post("/api/ratings", {
        videoId,
        rating,
      });

      setUserRating(rating);
      // optionally update stats here
    } catch (error: any) {
      console.error("Failed to submit rating:", error);
      alert(error.response?.data?.error || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-full lg:w-64">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Rate this video
      </h4>

      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={submitting}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                (
                  hoveredRating !== null
                    ? star <= hoveredRating
                    : star <= (userRating || 0)
                )
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      {userRating && (
        <p className="text-xs text-gray-600 mt-2">
          You rated this video {userRating} star{userRating !== 1 ? "s" : ""}
        </p>
      )}

      {submitting && (
        <p className="text-xs text-blue-600 mt-2">Submitting rating...</p>
      )}
    </div>
  );
};

export default RatingSection;
