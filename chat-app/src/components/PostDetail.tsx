import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Heart, MessageSquare, Bookmark, Share2, Sparkles, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { CommentSection } from './Comments/CommentSection.tsx';

export const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const { posts, users, toggleLike } = useStore();
  
  const [unicorns, setUnicorns] = useState<number>(12);
  const [isUnicorned, setIsUnicorned] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-xl font-bold">Post not found</div>
        <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </Button>
      </div>
    );
  }

  const authorUser = post.author ? users.find(u => u.id === post.author?.id) || post.author : post.createdBy;
  const isLiked = post.isLiked;
  const likesCount = post._count?.likes ?? post.likes ?? 0;
  const commentsCount = post.comments?.length ?? 0;

  const handleUnicornToggle = () => {
    setIsUnicorned(!isUnicorned);
    setUnicorns(prev => isUnicorned ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-auto w-full max-w-[1240px]">
      
      {/* DEV.to Left Sticky Reaction Rail (Desktop) */}
      <aside className="hidden lg:flex flex-col items-center gap-6 w-14 shrink-0 pt-6 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto text-muted-foreground [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button 
          onClick={() => toggleLike(post.id)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-red-500/10 text-red-500' : 'hover:bg-muted group-hover:text-red-500'}`}>
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </div>
          <span className="text-xs font-semibold">{likesCount}</span>
        </button>

        <button 
          onClick={handleUnicornToggle}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full text-xl transition-colors ${isUnicorned ? 'bg-amber-500/10' : 'hover:bg-muted'}`}>
            🦄
          </div>
          <span className="text-xs font-semibold">{unicorns}</span>
        </button>

        <button 
          onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 rounded-full hover:bg-muted group-hover:text-[#3b49df] transition-colors">
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">{commentsCount}</span>
        </button>

        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full transition-colors ${isBookmarked ? 'bg-[#3b49df]/10 text-[#3b49df]' : 'hover:bg-muted group-hover:text-[#3b49df]'}`}>
            <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-[#3b49df]' : ''}`} />
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-3 rounded-full hover:bg-muted group-hover:text-foreground transition-colors">
            <Share2 className="h-6 w-6" />
          </div>
        </button>
      </aside>

      {/* Main Article Container */}
      <article className="flex-1 min-w-0 bg-card rounded-md border border-border/80 overflow-hidden shadow-2xs">
        {(post.coverImage || post.imageUrl) && (
          <div 
            className="w-full h-64 sm:h-80 md:h-96 bg-muted"
            style={{ backgroundImage: `url(${post.coverImage || post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        
        <div className="p-4 sm:p-8 md:p-12">
          {/* Author Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60 cursor-pointer" onClick={() => navigate('/profile')}>
                <AvatarImage src={authorUser?.avatar} />
                <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'DEV'}</AvatarFallback>
              </Avatar>
              <div>
                <div 
                  className="font-bold text-base text-foreground hover:text-[#3b49df] cursor-pointer transition-colors"
                  onClick={() => navigate('/profile')}
                >
                  {authorUser?.name || 'DEV Contributor'}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Posted on {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 4 min read
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white rounded-md font-medium text-sm hidden sm:flex"
              size="sm"
            >
              Follow
            </Button>
          </div>
          
          {/* Article Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">
            {post.title || "Untitled Article"}
          </h1>
          
          {/* Tag Badges */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-sm text-muted-foreground hover:text-foreground hover:bg-[#3b49df]/10 hover:border-[#3b49df]/30 px-2.5 py-1 rounded transition-colors cursor-pointer border border-transparent font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Article Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-sans space-y-4 pt-2">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/* Mobile Reactions Bar */}
        <div className="lg:hidden flex items-center justify-around py-3 border-t border-border/60 bg-muted/20 px-4">
          <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className={isLiked ? 'text-red-500' : ''}>
            <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleUnicornToggle}>
            🦄 {unicorns}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
            <MessageSquare className="h-5 w-5 mr-1" /> {commentsCount}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-[#3b49df] text-[#3b49df]' : ''}`} />
          </Button>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border/60">
          <CommentSection postId={post.id} comments={post.comments || []} commentsCount={commentsCount} />
        </div>
      </article>

      {/* DEV.to Right Sidebar - Author Info Card */}
      <aside className="hidden lg:flex flex-col gap-4 w-80 shrink-0 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs border-t-[32px] border-t-[#3b49df]">
          <div className="p-5">
            <div className="flex items-end gap-3 -mt-10 mb-4">
              <Avatar className="h-16 w-16 border-4 border-card bg-card shadow-xs cursor-pointer" onClick={() => navigate('/profile')}>
                <AvatarImage src={authorUser?.avatar} />
                <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'DEV'}</AvatarFallback>
              </Avatar>
              <h3 
                className="font-bold text-xl text-foreground hover:text-[#3b49df] cursor-pointer transition-colors pb-0.5"
                onClick={() => navigate('/profile')}
              >
                {authorUser?.name || 'DEV Contributor'}
              </h3>
            </div>
            
            <Button className="w-full bg-[#3b49df] hover:bg-[#2f3ab2] text-white font-medium mb-4 rounded-md">
              Follow
            </Button>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {authorUser?.bio || 'Full-stack software developer sharing insights on web technologies, architecture, and developer tooling.'}
            </p>
            
            <div className="space-y-2 text-xs text-muted-foreground border-t border-border/40 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined DEV on Jan 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* More from Author */}
        <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-border/60 font-bold text-sm bg-muted/20">
            More from <span className="text-[#3b49df]">{authorUser?.name || 'Author'}</span>
          </div>
          <div className="divide-y divide-border/40">
            {[
              { title: '10 React Performance Optimizations You Must Know', tag: 'react' },
              { title: 'Understanding TypeScript Generics with Practical Examples', tag: 'typescript' },
              { title: 'How we scaled our API to handle 10M requests/day', tag: 'backend' },
            ].map((item, idx) => (
              <a 
                key={idx} 
                className="p-4 block hover:bg-muted/40 cursor-pointer transition-colors group"
                onClick={() => navigate('/')}
              >
                <div className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  #{item.tag}
                </div>
              </a>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
};
