import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { FeedTabs } from '../components/feed/FeedTabs';
import { PostCard } from '../components/feed/PostCard';
import type { FeedTab } from '../components/feed/FeedTabs';

export const FeedPage: React.FC = () => {
  const { posts, users, currentUser, toggleLike, addComment } = useStore();
  const [activeTab, setActiveTab] = useState<FeedTab>('relevant');
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  const handleComment = (postId: number) => {
    const content = commentInputs[postId];
    if (content && content.trim()) {
      addComment(postId, content);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (activeTab === 'top') return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {sortedPosts.map(post => {
        const authorUser = post.author
          ? users.find(u => u.id === post.author?.id) || post.author
          : post.createdBy;
        return (
          <PostCard
            key={post.id}
            post={post}
            authorUser={authorUser}
            currentUser={currentUser}
            commentInput={commentInputs[post.id] || ''}
            showComments={showComments[post.id] || false}
            onLike={() => toggleLike(post.id)}
            onCommentToggle={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
            onCommentChange={val => setCommentInputs(prev => ({ ...prev, [post.id]: val }))}
            onCommentSubmit={() => handleComment(post.id)}
          />
        );
      })}
    </div>
  );
};
