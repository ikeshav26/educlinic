import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageSquare } from 'lucide-react';
import type { Comment } from '../../types';
import { useStore } from '../../store/mockData';

export const CommentItem: React.FC<{
  comment: Comment;
  postId: number;
  depth?: number;
}> = ({ comment, postId, depth = 0 }) => {
  const { addComment } = useStore();
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(3);

  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      addComment(postId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'pl-4 sm:pl-6 border-l-2 border-border/60 ml-3 sm:ml-4' : ''}`}>
      <div className="bg-card border border-border/80 rounded-md p-3 sm:p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0 border border-border/60">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-foreground hover:text-[#3b49df] cursor-pointer">
                {comment.author.name}
              </span>
              <span className="text-xs text-muted-foreground">• {formatTime(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-foreground/90 leading-relaxed pl-9 whitespace-pre-wrap">
          {comment.content}
        </div>

        <div className="flex items-center gap-4 pl-9 pt-1 text-xs text-muted-foreground">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer ${isLiked ? 'text-red-500 font-medium' : ''}`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} likes</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 hover:text-[#3b49df] transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>
        </div>
      </div>

      {isReplying && (
        <div className="flex gap-2 pl-6 pt-2">
          <textarea
            className="flex-1 min-h-[60px] p-2.5 text-xs sm:text-sm rounded-md border border-border/80 bg-background resize-y focus:outline-none focus:ring-1 focus:ring-[#3b49df]"
            placeholder={`Reply to ${comment.author.name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col gap-1">
            <button
              className="bg-[#3b49df] text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-[#2f3ab2] disabled:opacity-50"
              disabled={!replyContent.trim()}
              onClick={handleReplySubmit}
            >
              Submit
            </button>
            <button
              className="text-xs text-muted-foreground hover:text-foreground py-1"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {hasReplies && showReplies && (
        <div className="space-y-2 pt-1">
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
