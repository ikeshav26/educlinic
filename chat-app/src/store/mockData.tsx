import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Post, Chat, Message, Comment } from '../types';
import { getSocket, connectSocket, disconnectSocket } from '../lib/socket';

interface StoreState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  chats: Chat[];
  isLoading: boolean;
  addPost: (title: string, content: string, coverImage: string, tags: string[]) => Promise<void>;
  toggleLike: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string, parentId?: number) => Promise<Comment | undefined>;
  deletePost: (postId: number) => Promise<boolean>;
  deleteComment: (commentId: number) => Promise<boolean>;
  toggleFollow: (userId: number, currentlyFollowing: boolean) => Promise<void>;
  fetchFollowCounts: (userId: number) => Promise<{ followersCount: number; followingCount: number; isFollowing: boolean }>;
  fetchConversations: () => Promise<void>;
  fetchMessagesWithUser: (partnerId: number) => Promise<Message[]>;
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  markAsRead: (partnerId: number) => Promise<void>;
  startDirectMessage: (partnerUser: User) => Chat;
  updateProfile: (name: string, bio: string, avatar: string, coverImage: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize store and authenticate user
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
          setPosts(postsData.posts || postsData);
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

  // Fetch initial conversations list once user is logged in
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const apiChats: Chat[] = (data.conversations || []).map((conv: any) => ({
          id: conv.id,
          participant: conv.participant,
          messages: conv.lastMessage ? [conv.lastMessage] : [],
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount || 0,
        }));
        setChats(apiChats);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      connectSocket();

      const socket = getSocket();

      const handleReceiveMessage = (msg: Message) => {
        setChats(prevChats => {
          const partnerId = msg.senderId === currentUser.id ? msg.receiverId! : msg.senderId;
          const existingChatIndex = prevChats.findIndex(c => c.id === partnerId);

          if (existingChatIndex !== -1) {
            const updated = [...prevChats];
            const chat = updated[existingChatIndex];
            const updatedMessages = chat.messages.some(m => m.id === msg.id)
              ? chat.messages
              : [...chat.messages, msg];

            const unreadInc = (msg.senderId !== currentUser.id && !msg.isRead) ? 1 : 0;

            updated[existingChatIndex] = {
              ...chat,
              messages: updatedMessages,
              lastMessage: msg,
              unreadCount: (chat.unreadCount || 0) + unreadInc,
            };
            return updated;
          } else {
            // New conversation started
            const partnerName = msg.senderId === currentUser.id
              ? (msg.receiver?.name || 'User')
              : (msg.sender?.name || 'User');

            const newChat: Chat = {
              id: partnerId,
              participant: {
                id: partnerId,
                name: partnerName,
              },
              messages: [msg],
              lastMessage: msg,
              unreadCount: msg.senderId !== currentUser.id ? 1 : 0,
            };
            return [newChat, ...prevChats];
          }
        });
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    } else {
      disconnectSocket();
    }
  }, [currentUser]);

  const fetchMessagesWithUser = async (partnerId: number): Promise<Message[]> => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages/${partnerId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const fetchedMsgs: Message[] = data.messages || [];

        // Update chats in state
        setChats(prev => prev.map(chat => {
          if (chat.id === partnerId) {
            return {
              ...chat,
              messages: fetchedMsgs,
              unreadCount: 0,
            };
          }
          return chat;
        }));

        return fetchedMsgs;
      }
    } catch (err) {
      console.error('Failed to fetch messages with user', err);
    }
    return [];
  };

  const markAsRead = async (partnerId: number) => {
    try {
      await fetch(`${API_BASE}/chat/read/${partnerId}`, {
        method: 'POST',
        credentials: 'include',
      });
      setChats(prev => prev.map(chat => {
        if (chat.id === partnerId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      }));
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  };

  const sendMessage = async (receiverId: number, content: string) => {
    if (!content.trim()) return;

    const socket = getSocket();
    if (socket.connected) {
      socket.emit('send_message', { receiverId, content: content.trim() });
    } else {
      // Fallback via HTTP REST
      try {
        const res = await fetch(`${API_BASE}/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId, content: content.trim() }),
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.message) {
            const msg: Message = data.message;
            setChats(prev => prev.map(chat => {
              if (chat.id === receiverId) {
                return {
                  ...chat,
                  messages: [...chat.messages, msg],
                  lastMessage: msg,
                };
              }
              return chat;
            }));
          }
        }
      } catch (err) {
        console.error('Failed to send message via HTTP', err);
      }
    }
  };

  const startDirectMessage = (partnerUser: User): Chat => {
    const existing = chats.find(c => c.id === partnerUser.id);
    if (existing) return existing;

    const newChat: Chat = {
      id: partnerUser.id,
      participant: partnerUser,
      messages: [],
      unreadCount: 0,
    };
    setChats(prev => [newChat, ...prev]);
    return newChat;
  };

  const addPost = async (title: string, content: string, coverImage: string, tags: string[]) => {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl: coverImage, tags }),
        credentials: 'include'
      });
      if (res.ok) {
        const postsRes = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || postsData);
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
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || postsData);
        }
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
        return await res.json();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const res = await fetch(`${API_BASE}/posts/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return res.ok;
    } catch (err) {
      console.error('deleteComment error', err);
      return false;
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('deletePost error', err);
      return false;
    }
  };

  const toggleFollow = async (userId: number, currentlyFollowing: boolean) => {
    try {
      if (currentlyFollowing) {
        await fetch(`${API_BASE}/follow`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toUnfollowUserId: userId }),
          credentials: 'include',
        });
      } else {
        await fetch(`${API_BASE}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toFollowUserId: userId }),
          credentials: 'include',
        });
      }
    } catch (err) {
      console.error('toggleFollow error', err);
    }
  };

  const fetchFollowCounts = async (userId: number) => {
    const res = await fetch(`${API_BASE}/follow/${userId}/counts`, { credentials: 'include' });
    if (!res.ok) return { followersCount: 0, followingCount: 0, isFollowing: false };
    return res.json() as Promise<{ followersCount: number; followingCount: number; isFollowing: boolean }>;
  };

  const updateProfile = (name: string, bio: string, avatar: string, coverImage: string) => {
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        users,
        posts,
        chats,
        isLoading,
        addPost,
        toggleLike,
        addComment,
        deletePost,
        deleteComment,
        toggleFollow,
        fetchFollowCounts,
        fetchConversations,
        fetchMessagesWithUser,
        sendMessage,
        markAsRead,
        startDirectMessage,
        updateProfile,
      }}
    >
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
