import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageSquare, Search } from 'lucide-react';

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
      {/* Chat Conversations List */}
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

      {/* Active Conversation Pane */}
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
                {activeChat.messages.map(msg => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[70%] rounded-md p-3 text-sm leading-relaxed ${
                          isMe 
                            ? 'bg-[#3b49df] text-white font-medium shadow-2xs' 
                            : 'bg-muted/70 text-foreground border border-border/60'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
};
