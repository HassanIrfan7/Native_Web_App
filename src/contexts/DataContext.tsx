import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, Comment, Rating, User } from '../types';

interface DataContextType {
  videos: Video[];
  comments: Comment[];
  ratings: Rating[];
  creators: User[];
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  updateVideo: (videoId: string, updates: Partial<Video>) => void;
  updateCreator: (creatorId: string, updates: Partial<User>) => void;
  getCreators: () => User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_VIDEOS: Video[] = [
  {
    id: 'video-1',
    title: 'Amazing Dance Performance',
    description: 'Check out this incredible dance routine that went viral!',
    publisher: 'DanceStudio Pro',
    producer: 'Creative Media Co.',
    genre: 'Dance',
    ageRating: 'PG',
    thumbnail: 'https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 45,
    views: 12500,
    likes: 1200,
    dislikes: 50,
    creatorId: 'creator-1',
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['dance', 'viral', 'performance']
  },
  {
    id: 'video-2',
    title: 'Cooking Made Easy',
    description: 'Quick and delicious recipes you can make at home',
    publisher: 'Home Kitchen',
    producer: 'Food Network Plus',
    genre: 'Cooking',
    ageRating: 'G',
    thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    duration: 120,
    views: 8900,
    likes: 890,
    dislikes: 20,
    creatorId: 'creator-1',
    createdAt: '2024-01-12T14:20:00Z',
    tags: ['cooking', 'recipe', 'food']
  },
  {
    id: 'video-3',
    title: 'Epic Gaming Moments',
    description: 'The most incredible gaming clips of the week',
    publisher: 'GameZone',
    producer: 'Gaming Studios',
    genre: 'Gaming',
    ageRating: 'PG-13',
    thumbnail: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    duration: 180,
    views: 25000,
    likes: 2100,
    dislikes: 80,
    creatorId: 'creator-1',
    createdAt: '2024-01-10T09:15:00Z',
    tags: ['gaming', 'highlight', 'epic']
  }
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    videoId: 'video-1',
    userId: 'consumer-1',
    userName: 'Video Watcher',
    userAvatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    content: 'This is absolutely amazing! Love the choreography.',
    createdAt: '2024-01-15T11:00:00Z',
    likes: 45
  },
  {
    id: 'comment-2',
    videoId: 'video-1',
    userId: 'consumer-1',
    userName: 'Dance Fan',
    userAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    content: 'Can you teach us this routine? 🔥',
    createdAt: '2024-01-15T12:30:00Z',
    likes: 23
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [creators, setCreators] = useState<User[]>([]);

  useEffect(() => {
    // Load creators from localStorage or initialize
    const savedCreators = localStorage.getItem('creators');
    if (savedCreators) {
      setCreators(JSON.parse(savedCreators));
    }
  }, []);

  const addVideo = (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => {
    const newVideo: Video = {
      ...videoData,
      id: `video-${Date.now()}`,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString()
    };
    setVideos(prev => [newVideo, ...prev]);
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [...prev, newComment]);
  };

  const addRating = (ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: `rating-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRatings(prev => [...prev, newRating]);
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, ...updates } : video
    ));
  };

  const updateCreator = (creatorId: string, updates: Partial<User>) => {
    setCreators(prev => {
      const updated = prev.map(creator => 
        creator.id === creatorId ? { ...creator, ...updates } : creator
      );
      localStorage.setItem('creators', JSON.stringify(updated));
      return updated;
    });
  };

  const getCreators = () => {
    return creators;
  };

  return (
    <DataContext.Provider value={{
      videos,
      comments,
      ratings,
      creators,
      addVideo,
      addComment,
      addRating,
      updateVideo,
      updateCreator,
      getCreators
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}