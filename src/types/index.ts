export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'creator' | 'consumer';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  publisher: string;
  producer: string;
  genre: string;
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | '18+';
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  creatorId: string;
  createdAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Rating {
  id: string;
  videoId: string;
  userId: string;
  rating: number;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  genre: string;
  ageRating: string;
  sortBy: 'newest' | 'popular' | 'views';
}