import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Post, Chat, Comment } from '../types';

interface StoreState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  chats: Chat[];
  isLoading: boolean;
  addPost: (title: string, content: string, coverImage: string, tags: string[]) => Promise<void>;
  toggleLike: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string, parentId?: number) => Promise<void>;
  toggleFollow: (userId: number) => void;
  sendMessage: (chatId: number, content: string) => void;
  updateProfile: (name: string, bio: string, avatar: string, coverImage: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const API_BASE = 'http://localhost:4000/api';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStore = async () => {
      try {
        // Fetch current user
        const userRes = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
        if (!userRes.ok) {
          // If unauthorized, redirect to the Next.js app
          window.location.href = 'http://localhost:3000';
          return;
        }
        const userData = await userRes.json();
        setCurrentUser(userData.user);

        // Fetch posts
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (err) {
        console.error('Failed to init store', err);
        window.location.href = 'http://localhost:3000';
      } finally {
        setIsLoading(false);
      }
    };
    initStore();
  }, []);

  const addPost = async (title: string, content: string, coverImage: string, tags: string[]) => {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl: coverImage, tags }),
        credentials: 'include'
      });
      if (res.ok) {
        const newPost = await res.json();
        // The API returns the post, we might want to refresh posts or just prepend it
        // For now, let's re-fetch to ensure counts and likes are correct, or just prepend
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) {
          setPosts(await postsRes.json());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      // Optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const currentlyLiked = post.isLiked;
          const count = post._count?.likes ?? 0;
          return {
            ...post,
            isLiked: !currentlyLiked,
            _count: { ...post._count, likes: currentlyLiked ? count - 1 : count + 1, comments: post._count?.comments ?? 0 }
          };
        }
        return post;
      }));

      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!res.ok) {
        // Revert on failure (simplified)
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) setPosts(await postsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId: number, content: string, parentId?: number) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
        credentials: 'include'
      });
      if (res.ok) {
        // Refresh posts to get new comments (simplified approach)
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) setPosts(await postsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = (userId: number) => {
    // not implemented backend
  };

  const sendMessage = (chatId: number, content: string) => {
    // not implemented backend
  };

  const updateProfile = (name: string, bio: string, avatar: string, coverImage: string) => {
    // not implemented backend
  };

  return (
    <StoreContext.Provider value={{ currentUser, users, posts, chats, isLoading, addPost, toggleLike, addComment, toggleFollow, sendMessage, updateProfile }}>
      {isLoading ? <div className="flex h-screen items-center justify-center">Loading...</div> : children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
