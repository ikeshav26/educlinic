export interface User {
  id: number;
  name: string;
  avatar?: string;
  isFollowed?: boolean;
  bio?: string;
  coverImage?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface Comment {
  id: number;
  author: User;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: number;
  author?: User;
  createdBy?: User;
  title?: string;
  content: string;
  imageUrl?: string;
  coverImage?: string;
  tags?: string[];
  likes?: number;
  _count?: { likes: number; comments: number };
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  participant: User;
  messages: Message[];
}
