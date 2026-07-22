import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/mockData';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import type { Chat as ChatType } from '../../types';

export const Chat: React.FC = () => {
  const {
    chats,
    currentUser,
    sendMessage,
    fetchMessagesWithUser,
    markAsRead,
    isLoading,
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');

  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);

  const handleSetActiveChatId = (id: number) => {
    setActiveChatId(id);
    setSearchParams({ userId: id.toString() });
  };

  // Auto-select chat from query params or first chat in list
  useEffect(() => {
    if (userIdParam) {
      const parsedId = parseInt(userIdParam, 10);
      if (!isNaN(parsedId) && parsedId !== activeChatId) {
        setActiveChatId(parsedId);
        return;
      }
    }

    if (activeChatId === null && chats.length > 0) {
      handleSetActiveChatId(chats[0].id);
    }
  }, [userIdParam, chats.length]);

  // Load message history when active chat changes
  useEffect(() => {
    if (activeChatId) {
      setMessagesLoading(true);
      fetchMessagesWithUser(activeChatId).finally(() => {
        setMessagesLoading(false);
      });
      markAsRead(activeChatId);
    }
  }, [activeChatId]);

  const activeChat: ChatType | undefined = chats.find(c => c.id === activeChatId);

  const handleSend = async () => {
    if (activeChatId && newMessage.trim()) {
      const msgText = newMessage.trim();
      setNewMessage('');
      await sendMessage(activeChatId, msgText);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-card rounded-xl shadow-sm ring-1 ring-border/20 overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={handleSetActiveChatId}
        isLoading={isLoading}
      />
      <ChatArea
        activeChat={activeChat}
        currentUser={currentUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        isLoading={isLoading || messagesLoading}
      />
    </div>
  );
};
