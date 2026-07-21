import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { Comment } from '../../types';
import { useStore } from '../../store/mockData';

export const CommentItem: React.FC<{
  comment: Comment;
  postId: number;
  depth?: number;
}> = ({ comment, postId, depth = 0 }) => {
  const { addComment, currentUser } = useStore();
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [likeCount, setLikeCount] = useState<number>(3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  // Cap nesting — replies of replies are shown flat (DEV.to style)
  const maxDepth = 1;

  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Focus + pre-fill @mention when reply box opens
  useEffect(() => {
    if (isReplying) {
      const mention = `@${comment.author.name} `;
      setReplyContent(mention);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Move cursor to end
          const len = mention.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 50);
    }
  }, [isReplying, comment.author.name]);

  const handleReplySubmit = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    await addComment(postId, trimmed, comment.id);
    setReplyContent('');
    setIsReplying(false);
    setShowReplies(true);
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleReplySubmit();
    }
    if (e.key === 'Escape') {
      setIsReplying(false);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'pl-4 sm:pl-6 border-l-2 border-[#3b49df]/20 ml-3 sm:ml-4' : ''}`}>
      {/* Comment card */}
      <div className="bg-card border border-border/80 rounded-md p-3 sm:p-4 shadow-2xs space-y-2 transition-shadow hover:shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0 border border-border/60">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback className="text-xs">{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm text-foreground hover:text-[#3b49df] cursor-pointer transition-colors">
                {comment.author.name}
              </span>
              {currentUser?.id === comment.author.id && (
                <span className="text-[10px] bg-[#3b49df]/10 text-[#3b49df] font-medium px-1.5 py-0.5 rounded">you</span>
              )}
              <span className="text-xs text-muted-foreground">• {formatTime(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-foreground/90 leading-relaxed pl-9 whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pl-9 pt-1 text-xs text-muted-foreground">
          {/* Like */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer select-none ${isLiked ? 'text-red-500 font-medium' : ''}`}
          >
            <Heart className={`h-3.5 w-3.5 transition-transform active:scale-125 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </button>

          {/* Reply — only show on top-level comments or if depth < maxDepth */}
          <button
            onClick={() => setIsReplying(prev => !prev)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer select-none ${isReplying ? 'text-[#3b49df] font-medium' : 'hover:text-[#3b49df]'}`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{isReplying ? 'Cancel reply' : 'Reply'}</span>
          </button>

          {/* Show / hide replies toggle */}
          {hasReplies && (
            <button
              onClick={() => setShowReplies(prev => !prev)}
              className="flex items-center gap-1 hover:text-[#3b49df] transition-colors cursor-pointer select-none ml-auto"
            >
              {showReplies
                ? <><ChevronUp className="h-3.5 w-3.5" /><span>Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span></>
                : <><ChevronDown className="h-3.5 w-3.5" /><span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span></>
              }
            </button>
          )}
        </div>
      </div>

      {/* Reply input */}
      {isReplying && (
        <div className="flex gap-2 pl-4 sm:pl-6 pt-1 animate-in slide-in-from-top-2 duration-150">
          <Avatar className="h-7 w-7 shrink-0 border border-border/60 mt-1">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="text-xs">{currentUser?.name?.substring(0, 2).toUpperCase() || 'ME'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[72px] p-2.5 text-xs sm:text-sm rounded-md border border-border/80 bg-background resize-y focus:outline-none focus:ring-2 focus:ring-[#3b49df]/30 text-foreground placeholder:text-muted-foreground/60 transition-shadow"
              placeholder={`Reply to ${comment.author.name}...`}
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-2 justify-between">
              <span className="text-[11px] text-muted-foreground hidden sm:block">Ctrl+Enter to submit · Esc to cancel</span>
              <div className="flex gap-2 ml-auto">
                <button
                  className="text-xs text-muted-foreground hover:text-foreground py-1 px-3 rounded-md border border-border/60 hover:border-border transition-colors"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#3b49df] text-white text-xs px-4 py-1.5 rounded-md font-medium hover:bg-[#2f3ab2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={!replyContent.trim() || isSubmitting}
                  onClick={handleReplySubmit}
                >
                  {isSubmitting ? 'Posting…' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nested replies */}
      {hasReplies && showReplies && (
        <div className="space-y-2 pt-1">
          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              // Flatten beyond maxDepth so replies-of-replies don't go infinitely deep
              depth={Math.min(depth + 1, maxDepth)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
