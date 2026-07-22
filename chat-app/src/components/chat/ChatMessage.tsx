import React from 'react';
import type { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
          isMe
            ? 'bg-[#3b82f6] text-white rounded-[20px] rounded-br-sm'
            : 'bg-muted/50 text-foreground rounded-[20px] rounded-bl-sm border border-border/20'
        }`}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 px-1 flex items-center gap-1 opacity-80 font-medium">
        {formatTime(message.createdAt)}
      </span>
    </div>
  );
};
