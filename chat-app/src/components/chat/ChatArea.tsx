import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, MessageSquare } from 'lucide-react';
import type { Chat, User } from '../../types';
import { ChatMessage } from './ChatMessage';

interface ChatAreaProps {
  activeChat: Chat | undefined;
  currentUser: User | null;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSend: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  activeChat,
  currentUser,
  newMessage,
  setNewMessage,
  handleSend,
}) => {
  return (
    <div className="flex-1 bg-card border border-border/80 rounded-md overflow-hidden flex flex-col shadow-2xs">
      {activeChat ? (
        <>
          <div className="p-3.5 border-b border-border/60 flex items-center bg-muted/20">
            <Avatar className="h-9 w-9 mr-3 border border-border/60 shrink-0">
              <AvatarImage src={activeChat.participant.avatar} />
              <AvatarFallback>{activeChat.participant.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-bold text-sm text-foreground block">{activeChat.participant.name}</span>
              <span className="text-xs text-muted-foreground">Active in DEV Direct Messages</span>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {activeChat.messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isMe={msg.senderId === currentUser?.id}
                />
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border/60 flex gap-2 bg-muted/10">
            <Input
              placeholder="Write your message..."
              className="h-10 text-sm bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-[#3b49df]"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white shrink-0 h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
          <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground/40" />
          <p className="text-sm font-medium">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
};
