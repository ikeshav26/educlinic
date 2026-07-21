import React, { useState } from 'react';
import { useStore } from '../../store/mockData';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';

export const Chat: React.FC = () => {
  const { chats, currentUser, sendMessage } = useStore();
  const [activeChatId, setActiveChatId] = useState<number | null>(chats.length > 0 ? chats[0].id : null);
  const [newMessage, setNewMessage] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSend = () => {
    if (activeChatId && newMessage.trim()) {
      sendMessage(activeChatId, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 pt-1 max-w-5xl mx-auto">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />
      <ChatArea
        activeChat={activeChat}
        currentUser={currentUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
      />
    </div>
  );
};
