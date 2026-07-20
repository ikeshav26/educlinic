import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Send } from 'lucide-react';

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
    <div className="flex h-[calc(100vh-40px)] gap-4 pt-4">
      {/* Chat List */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b font-semibold bg-muted/30">Messages</div>
        <ScrollArea className="flex-1">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeChatId === chat.id ? 'bg-muted' : ''}`}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={chat.participant.avatar} />
                <AvatarFallback>{chat.participant.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-sm truncate">{chat.participant.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : 'No messages yet'}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>

      {/* Active Chat */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b flex items-center bg-muted/30">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={activeChat.participant.avatar} />
                <AvatarFallback>{activeChat.participant.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{activeChat.participant.name}</span>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeChat.messages.map(msg => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t flex space-x-2">
              <Input 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSend();
                }}
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
};
