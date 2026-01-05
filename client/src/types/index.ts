export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

