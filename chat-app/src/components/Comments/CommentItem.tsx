import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart } from 'lucide-react';
import type { Comment } from '../../types';
import { useStore } from '../../store/mockData';

export const CommentItem: React.FC<{ 
  comment: Comment; 
  postId: number;
  depth?: number;
}> = ({ comment, postId, depth = 0 }) => {
  const { addComment } = useStore();
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      addComment(postId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true); // show replies so they can see their new comment
    }
  };

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;
  
  // Instagram style indentation only applies if it's not the top level
  const paddingLeft = depth > 0 ? 'pl-11' : '';

  return (
    <div className={`flex flex-col gap-1 mb-4 ${paddingLeft}`}>
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[13px]">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
          </div>
          
          <div className="text-[14px] mt-0.5 whitespace-pre-wrap leading-snug">
            {comment.content}
          </div>
          
          <div className="flex items-center gap-4 mt-1.5 text-xs font-semibold text-muted-foreground">
            {depth === 0 && <span className="cursor-pointer hover:text-foreground">2,474 likes</span>}
            <button className="cursor-pointer hover:text-foreground" onClick={() => setIsReplying(!isReplying)}>Reply</button>
          </div>
        </div>
        
        <div className="shrink-0 pt-2 pr-2 cursor-pointer" onClick={() => setIsLiked(!isLiked)}>
          <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} strokeWidth={isLiked ? 1 : 2} />
        </div>
      </div>

      {isReplying && (
        <div className="flex gap-3 mt-2 pl-12 pr-4">
          <textarea 
            className="flex-1 min-h-[40px] p-2 text-sm rounded-md border border-border/50 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder={`Reply to ${comment.author.name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            autoFocus
          />
          <button 
            className="text-primary font-semibold text-sm self-end pb-2 disabled:opacity-50"
            disabled={!replyContent.trim()}
            onClick={handleReplySubmit}
          >
            Post
          </button>
        </div>
      )}

      {hasReplies && !showReplies && (
        <div className="pl-12 mt-2">
          <button 
            className="flex items-center gap-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
            onClick={() => setShowReplies(true)}
          >
            <div className="h-[1px] w-6 bg-border/80"></div>
            View {replies.length} more {replies.length === 1 ? 'reply' : 'replies'}
          </button>
        </div>
      )}

      {hasReplies && showReplies && (
        <div className="mt-4 space-y-1">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              postId={postId}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
