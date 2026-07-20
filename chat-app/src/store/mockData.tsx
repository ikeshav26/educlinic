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
        const userRes = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
        if (!userRes.ok) {
          window.location.href = 'http://localhost:3000';
          return;
        }
        const userData = await userRes.json();
        setCurrentUser(userData.user);

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
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) setPosts(await postsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = (userId: number) => {
  };

  const sendMessage = (chatId: number, content: string) => {
  };

  const updateProfile = (name: string, bio: string, avatar: string, coverImage: string) => {
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
