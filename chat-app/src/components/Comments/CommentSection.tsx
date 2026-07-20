import React, { useState } from 'react';
import { useStore } from '../../store/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CommentItem } from './CommentItem';
import type { Comment } from '../../types';
import { MessageSquare, ShieldAlert } from 'lucide-react';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  commentsCount: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, commentsCount }) => {
  const { currentUser, addComment } = useStore();
  const [commentInput, setCommentInput] = useState('');

  const handleCommentSubmit = () => {
    if (commentInput.trim()) {
      addComment(postId, commentInput);
      setCommentInput('');
    }
  };

  return (
    <div id="comments" className="p-4 sm:p-8 md:p-12 space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#3b49df]" />
          <span>Top comments ({commentsCount})</span>
        </h2>
        <a href="#code-of-conduct" className="text-xs text-muted-foreground hover:text-[#3b49df] flex items-center gap-1">
          <ShieldAlert className="h-3.5 w-3.5" /> Code of Conduct
        </a>
      </div>
      
      {/* Top Level Input */}
      <div className="flex gap-3 sm:gap-4">
        <Avatar className="h-9 w-9 shrink-0 border border-border/60">
          <AvatarImage src={currentUser?.avatar} />
          <AvatarFallback>{currentUser?.name?.substring(0, 2) || 'ME'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3 min-w-0">
          <textarea 
            className="w-full min-h-[90px] p-3 text-sm rounded-md border border-border/80 bg-background resize-y focus:outline-none focus:ring-2 focus:ring-[#3b49df]/30 text-foreground placeholder:text-muted-foreground/60"
            placeholder="Add to the discussion..." 
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button 
              onClick={handleCommentSubmit} 
              disabled={!commentInput.trim()} 
              size="sm" 
              className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white rounded-md px-5 font-medium"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4 pt-4">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            postId={postId}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8 text-sm bg-muted/20 rounded-md border border-dashed border-border/60">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};
