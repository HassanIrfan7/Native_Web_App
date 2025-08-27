import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Video,
  Eye,
  Star,
  MessageCircle,
  TrendingUp,
  Users,
  Play,
  Calendar,
} from "lucide-react";
import { authApi } from "../../services/api.service"; // ✅ authenticated axios instance

interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  totalComments: number;
  averageRating: number;
  recentVideos: Array<{
    id: number;
    title: string;
    views: number;
    rating_count: number;
    comment_count: number;
    created_at: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalViews: 0,
    totalComments: 0,
    averageRating: 0,
    recentVideos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      const { data: videos } = await authApi.get("/videos/creator/my-videos");

      const totalVideos = videos.length;
      const totalViews = videos.reduce(
        (sum: number, video: any) => sum + video.views,
        0
      );
      const totalComments = videos.reduce(
        (sum: number, video: any) => sum + video.comment_count,
        0
      );
      const totalRatings = videos.reduce(
        (sum: number, video: any) =>
          sum + parseFloat(video.average_rating) * video.rating_count,
        0
      );
      const ratingCount = videos.reduce(
        (sum: number, video: any) => sum + video.rating_count,
        0
      );
      const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

      const recentVideos = [...videos]
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);

      setStats({
        totalVideos,
        totalViews,
        totalComments,
        averageRating,
        recentVideos,
      });
    } catch (error: any) {
      console.error(
        "Failed to fetch dashboard stats:",
        error?.response || error
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-400 mt-2">
          Here's how your content is performing
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Videos"
          value={stats.totalVideos}
          icon={<Video className="h-6 w-6 text-white" />}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={<Eye className="h-6 w-6 text-white" />}
          color="bg-green-600"
        />
        <StatCard
          title="Total Comments"
          value={stats.totalComments}
          icon={<MessageCircle className="h-6 w-6 text-white" />}
          color="bg-purple-600"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={<Star className="h-6 w-6 text-white" />}
          color="bg-yellow-600"
        />
      </div>

      {/* Recent Videos + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Videos */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Recent Videos
            </h3>
          </div>
          <div className="p-6">
            {stats.recentVideos.length === 0 ? (
              <div className="text-center py-8">
                <Play className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400">No videos uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white truncate">
                        {video.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{video.rating_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{video.comment_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(video.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-400" />
              Quick Actions
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/admin/upload"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition-colors"
            >
              Upload New Video
            </a>
            <a
              href="/admin/videos"
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg transition-colors"
            >
              Manage Videos
            </a>
            <a
              href="/admin/analytics"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg transition-colors"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
