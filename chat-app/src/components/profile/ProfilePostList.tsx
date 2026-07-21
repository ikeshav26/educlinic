import React from 'react';
import type { Post } from '../../types';
import { FileText, Bookmark, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stripHtml } from '../../utils/text';

type ProfileTab = 'posts' | 'saved';

interface ProfilePostListProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  isMe: boolean;
  userPosts: Post[];
}

export const ProfilePostList: React.FC<ProfilePostListProps> = ({
  activeTab,
  setActiveTab,
  isMe,
  userPosts,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center border-b border-border/60 gap-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 font-semibold text-base transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'posts'
              ? 'border-[#3b49df] text-[#3b49df]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="h-4 w-4" /> Posts ({userPosts.length})
        </button>
        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 font-semibold text-base transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'saved'
                ? 'border-[#3b49df] text-[#3b49df]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bookmark className="h-4 w-4" /> Reading List
          </button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            userPosts.map(post => (
              <div
                key={post.id}
                className="bg-card border border-border/80 rounded-md p-5 shadow-2xs hover:border-[#3b49df]/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <h3 className="text-xl font-extrabold text-foreground hover:text-[#3b49df] transition-colors mb-2">
                  {post.title || stripHtml(post.content)}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {stripHtml(post.content)}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-red-500" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post.comments.length}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-card rounded-md border border-dashed border-border/80">
              <p className="text-muted-foreground text-sm">No posts published yet.</p>
            </div>
          )
        )}

        {activeTab === 'saved' && (
          <div className="text-center p-12 bg-card rounded-md border border-dashed border-border/80">
            <p className="text-muted-foreground text-sm">Your reading list is empty.</p>
          </div>
        )}
      </div>
    </>
  );
};
