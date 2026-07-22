import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../../types';
import { MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { useStore } from '../../store/mockData';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
  onEdit: (msg: Message) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe, onEdit }) => {
  const { deleteMessage } = useStore();
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showOptions]);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id);
    }
    setShowOptions(false);
  };

  const handleEdit = () => {
    onEdit(message);
    setShowOptions(false);
  };

  return (
    <div 
      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-2 group relative`}
      ref={dropdownRef}
    >
      <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
            isMe
              ? 'bg-[#3b82f6] text-white rounded-[20px] rounded-br-sm'
              : 'bg-muted/50 text-foreground rounded-[20px] rounded-bl-sm border border-border/20'
          }`}
        >
          {message.content}
        </div>
        
        {/* Three dots menu trigger */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {/* Dropdown Menu */}
          {showOptions && (
            <div className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} z-50 w-36 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border/60 py-1.5 text-[13px] overflow-hidden flex flex-col origin-bottom animate-in fade-in zoom-in-95 duration-150`}>
              <button 
                onClick={handleCopy}
                className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-muted/60 transition-colors text-foreground font-medium"
              >
                <Copy className="h-4 w-4 opacity-70" /> Copy
              </button>
              {isMe && (
                <>
                  <button 
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-muted/60 transition-colors text-foreground font-medium"
                  >
                    <Edit2 className="h-4 w-4 opacity-70" /> Edit
                  </button>
                  <div className="h-px bg-border/40 mx-2 my-0.5" />
                  <button 
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors text-red-500 font-medium"
                  >
                    <Trash2 className="h-4 w-4 opacity-70" /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <span className="text-[10px] text-muted-foreground mt-1 px-1 flex items-center gap-1 opacity-80 font-medium">
        {formatTime(message.createdAt)}
        {message.isEdited && <span className="italic ml-1">(edited)</span>}
      </span>
    </div>
  );
};
