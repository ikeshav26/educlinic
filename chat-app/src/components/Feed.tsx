import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Heart, MessageSquare, Bookmark, Flame, Sparkles, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Feed: React.FC = () => {
  const { posts, users, currentUser, toggleLike, addComment } = useStore();
  const [activeTab, setActiveTab] = useState<'relevant' | 'latest' | 'top'>('relevant');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const handleComment = (postId: number) => {
    const content = commentInputs[postId];
    if (content && content.trim()) {
      addComment(postId, content);
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  // Sort posts based on selected tab
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (activeTab === 'top') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0; // default order
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* DEV.to Feed Tab Headers */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-border/40 pb-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('relevant')}
          className={`font-medium text-base h-9 px-3 rounded-md transition-colors ${
            activeTab === 'relevant' 
              ? 'font-bold text-[#3b49df] bg-card shadow-2xs border border-border/60' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />
          Relevant
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('latest')}
          className={`font-medium text-base h-9 px-3 rounded-md transition-colors ${
            activeTab === 'latest' 
              ? 'font-bold text-[#3b49df] bg-card shadow-2xs border border-border/60' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
          Latest
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('top')}
          className={`font-medium text-base h-9 px-3 rounded-md transition-colors ${
            activeTab === 'top' 
              ? 'font-bold text-[#3b49df] bg-card shadow-2xs border border-border/60' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Flame className="h-4 w-4 mr-1.5 text-orange-500" />
          Top
        </Button>
      </div>

      {/* DEV.to Feed Cards */}
      {sortedPosts.map((post, index) => {
        const authorUser = post.author ? users.find(u => u.id === post.author?.id) || post.author : post.createdBy;
        const coverImg = post.coverImage || post.imageUrl;
        const hasCover = Boolean(coverImg);
        const likesCount = post._count?.likes ?? post.likes ?? 0;
        const commentsCount = post.comments?.length ?? 0;

        return (
          <article 
            key={post.id} 
            className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
          >
            {/* Top Cover Image (if available or for top post) */}
            {hasCover && (
              <div 
                className="w-full h-48 sm:h-64 bg-muted cursor-pointer hover:opacity-95 transition-opacity"
                style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => navigate(`/post/${post.id}`)}
              />
            )}
            
            <div className="p-4 sm:p-5">
              {/* Author Row */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9 border border-border/60 shrink-0 cursor-pointer" onClick={() => navigate(`/profile`)}>
                  <AvatarImage src={authorUser?.avatar} />
                  <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'DEV'}</AvatarFallback>
                </Avatar>
                <div>
                  <div 
                    className="font-medium text-sm text-foreground hover:text-[#3b49df] cursor-pointer transition-colors leading-tight"
                    onClick={() => navigate(`/profile`)}
                  >
                    {authorUser?.name || 'DEV Contributor'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Title & Tags - Indented like DEV.to */}
              <div className="pl-0 sm:pl-12">
                <h2 
                  className="text-xl sm:text-2xl font-extrabold text-foreground hover:text-[#3b49df] cursor-pointer transition-colors leading-snug tracking-tight mb-2"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.title || post.content}
                </h2>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs text-muted-foreground hover:text-foreground hover:bg-[#3b49df]/10 hover:border-[#3b49df]/30 px-2 py-1 rounded transition-colors cursor-pointer border border-transparent font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Excerpt if content is longer */}
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed my-2">
                  {post.content}
                </p>

                {/* DEV.to Bottom Action Bar */}
                <div className="flex items-center justify-between pt-3 mt-2">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Reactions Button */}
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${
                        post.isLiked 
                          ? 'bg-red-500/10 text-red-600 font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span className="flex items-center gap-0.5">
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>❤️</span>
                        <span className="hidden sm:inline">🦄</span>
                      </span>
                      <span>{likesCount}</span>
                      <span className="hidden sm:inline">reactions</span>
                    </button>

                    {/* Comments Button */}
                    <button 
                      onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{commentsCount}</span>
                      <span className="hidden sm:inline">comments</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">3 min read</span>
                    <button 
                      className="p-2 rounded-md hover:bg-[#3b49df]/10 hover:text-[#3b49df] transition-colors cursor-pointer"
                      title="Save to Reading List"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Comments Section */}
                {showComments[post.id] && (
                  <div className="w-full space-y-3 pt-4 border-t border-border/60 mt-4">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>{currentUser?.name?.substring(0, 2) || 'ME'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input 
                          placeholder="Add to the discussion..." 
                          className="h-9 text-xs sm:text-sm bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-[#3b49df]"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleComment(post.id);
                          }}
                        />
                        <Button 
                          size="sm" 
                          className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white h-9 px-4"
                          onClick={() => handleComment(post.id)}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2 text-xs sm:text-sm">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 p-3 rounded-md border border-border/60">
                            <div className="font-semibold text-xs mb-1 text-foreground">{comment.author.name}</div>
                            <div className="text-foreground/90 leading-relaxed">{comment.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
