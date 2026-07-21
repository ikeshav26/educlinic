import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { MessageSquare, Search } from 'lucide-react';
import type { Chat } from '../../types';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: number | null;
  setActiveChatId: (id: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, activeChatId, setActiveChatId }) => {
  return (
    <div className="w-80 shrink-0 bg-card border border-border/80 rounded-md overflow-hidden flex flex-col shadow-2xs">
      <div className="p-3.5 border-b border-border/60 font-bold text-base bg-muted/20 flex items-center gap-2 text-foreground">
        <MessageSquare className="h-4 w-4 text-[#3b49df]" />
        <span>Direct Messages</span>
      </div>

      <div className="p-2 border-b border-border/40">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 h-8 text-xs bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-[#3b49df]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 divide-y divide-border/40">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`flex items-center p-3 cursor-pointer hover:bg-muted/40 transition-colors ${
              activeChatId === chat.id ? 'bg-[#3b49df]/10 border-l-4 border-l-[#3b49df]' : ''
            }`}
          >
            <Avatar className="h-9 w-9 mr-3 shrink-0 border border-border/60">
              <AvatarImage src={chat.participant.avatar} />
              <AvatarFallback>{chat.participant.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden min-w-0">
              <div className="font-semibold text-sm truncate text-foreground">{chat.participant.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : 'No messages yet'}
              </div>
            </div>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No conversations yet.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
