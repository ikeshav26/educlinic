import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, MessageSquare, Paperclip, Search, MoreVertical } from 'lucide-react';
import type { Chat, User, Message } from '../../types';
import { getAvatarUrl } from '../../lib/utils';
import { ChatMessage } from './ChatMessage';
import { Skeleton } from '../ui/skeleton';

interface ChatAreaProps {
  activeChat: Chat | undefined;
  currentUser: User | null;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSend: () => void;
  isLoading?: boolean;
}

const formatDividerDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0 && now.getDate() === date.getDate()) {
    return 'TODAY';
  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) {
    return 'YESTERDAY';
  } else {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  activeChat,
  currentUser,
  newMessage,
  setNewMessage,
  handleSend,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  if (activeChat) {
    let currentDate = '';
    activeChat.messages.forEach(msg => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groupedMessages.push({ date: msg.createdAt, messages: [msg] });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(msg);
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 flex flex-col justify-end h-full pt-10">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-64 rounded-[20px] rounded-bl-sm bg-muted/50" />
              <Skeleton className="h-16 w-80 rounded-[20px] rounded-bl-sm bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Skeleton className="h-12 w-72 rounded-[20px] rounded-br-sm bg-[#3b82f6]/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-48 rounded-[20px] rounded-bl-sm bg-muted/50" />
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 pt-2 border-none">
          <Skeleton className="h-12 w-full rounded-full bg-muted/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background overflow-hidden flex flex-col">
      {activeChat ? (
        <>
          <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-background z-10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(activeChat.participant.name, activeChat.participant.avatar)} />
                <AvatarFallback className="font-semibold bg-muted">{activeChat.participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold text-base text-foreground">{activeChat.participant.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="hover:text-foreground transition-colors"><Search className="h-5 w-5" /></button>
              <button className="hover:text-foreground transition-colors"><MoreVertical className="h-5 w-5" /></button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-6 py-4 bg-slate-50/50">
            <div className="space-y-6 min-h-full flex flex-col justify-end">
              {activeChat.messages.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground my-8">
                  No previous messages. Say hi to {activeChat.participant.name}!
                </div>
              ) : (
                groupedMessages.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-4">
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-muted/30 rounded-full text-[10px] font-semibold tracking-wider text-muted-foreground">
                        {formatDividerDate(group.date)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {group.messages.map(msg => (
                        <ChatMessage
                          key={msg.id}
                          message={msg}
                          isMe={msg.senderId === currentUser?.id}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 pt-2 bg-slate-50/50 flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <button className="absolute left-4 text-muted-foreground hover:text-foreground transition-colors z-10">
                <Paperclip className="h-5 w-5" />
              </button>
              <Input
                placeholder="Message"
                className="h-12 pl-12 pr-12 text-sm bg-background border border-border/50 rounded-full shadow-sm focus-visible:ring-1 focus-visible:ring-border w-full"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSend();
                }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="absolute right-4 text-muted-foreground hover:text-[#3b82f6] transition-colors disabled:opacity-50 disabled:hover:text-muted-foreground z-10"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
          <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground/30" />
          <p className="text-base font-medium">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};
