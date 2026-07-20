import React, { useState } from 'react';
import { useStore } from '../../store/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CommentItem } from './CommentItem';
import type { Comment } from '../../types';

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
    <div id="comments" className="px-4 py-8 sm:px-10 max-w-2xl mx-auto border-t border-border/40 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Comments ({commentsCount})</h2>
      </div>
      
      {/* Top Level Input */}
      <div className="flex gap-4 mb-10">
        <Avatar className="h-10 w-10 mt-1 shrink-0">
          <AvatarImage src={currentUser?.avatar} />
          <AvatarFallback>{currentUser?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <textarea 
            className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-border/50 bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Add a comment..." 
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleCommentSubmit} disabled={!commentInput.trim()} size="sm" className="rounded-full px-6">
              Post
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            postId={postId}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to start the conversation!
          </div>
        )}
      </div>
    </div>
  );
};
