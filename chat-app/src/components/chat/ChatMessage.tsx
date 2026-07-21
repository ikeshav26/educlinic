import React from 'react';
import type { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-md p-3 text-sm leading-relaxed ${
          isMe
            ? 'bg-[#3b49df] text-white font-medium shadow-2xs'
            : 'bg-muted/70 text-foreground border border-border/60'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
