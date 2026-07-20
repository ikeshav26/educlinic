import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Heart, MessageCircle, BookmarkPlus, Share2 } from 'lucide-react';
import { CommentSection } from './Comments/CommentSection.tsx';

export const PostDetail: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);
  const { posts, users, toggleLike } = useStore();
  
  const post = posts.find(p => p.id === postId);
  if (!post) return <div className="p-8 text-center text-muted-foreground">Post not found</div>;

  const authorUser = post.author ? users.find(u => u.id === post.author?.id) || post.author : post.createdBy;
  const isLiked = post.isLiked;
  const likesCount = post._count?.likes ?? post.likes ?? 0;
  const commentsCount = post.comments?.length ?? 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 mx-auto w-full max-w-[1000px]">
      {/* Main Content */}
      <article className="flex-1 min-w-0 bg-card rounded-xl border border-border/40 overflow-hidden shadow-sm">
        {(post.coverImage || post.imageUrl) && (
          <div 
            className="w-full h-64 sm:h-80 bg-muted"
            style={{ backgroundImage: `url(${post.coverImage || post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        
        <div className="px-4 py-6 sm:px-10 sm:py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-12 w-12 border border-border/50">
              <AvatarImage src={authorUser?.avatar} />
              <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-base hover:text-primary cursor-pointer">
                {authorUser?.name || 'Unknown User'}
              </div>
              <div className="text-sm text-muted-foreground">
                Posted on {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            {post.title || "Untitled Post"}
          </h1>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors px-2 py-1 rounded-md border border-transparent hover:border-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold">
            <p className="text-lg whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/* Inline Action Bar */}
        <div className="flex items-center justify-start gap-2 sm:gap-6 py-4 border-t border-border/40 px-4 sm:px-10">
           <Button variant="ghost" onClick={() => toggleLike(post.id)} className={`flex gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}>
             <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /> 
             <span className="font-medium">{likesCount > 0 ? likesCount : 'Like'}</span>
           </Button>
           <Button variant="ghost" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex gap-2 text-muted-foreground hover:text-foreground">
             <MessageCircle className="h-5 w-5" /> 
             <span className="font-medium">{commentsCount > 0 ? commentsCount : 'Comment'}</span>
           </Button>
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground ml-auto"><BookmarkPlus className="h-5 w-5" /></Button>
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Share2 className="h-5 w-5" /></Button>
        </div>

        <hr className="border-border/40" />

        <CommentSection postId={post.id} comments={post.comments || []} commentsCount={commentsCount} />
      </article>

      {/* Right Sidebar - Author Card */}
      <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0 py-8 sticky top-14 self-start">
        <Card className="border border-border/40 shadow-sm border-t-8 border-t-primary overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-end gap-3 -mt-10 mb-3">
              <Avatar className="h-16 w-16 border-4 border-card bg-card shadow-sm">
                <AvatarImage src={authorUser?.avatar} />
                <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'U'}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-xl pb-1">{authorUser?.name || 'Unknown User'}</h3>
            </div>
            
            <Button className="w-full mb-4 rounded-full font-bold">Follow</Button>
            
            <div className="text-sm text-foreground/80 mb-4 leading-relaxed">
              {authorUser?.bio || 'Passionate developer sharing knowledge and experiences. Always learning something new.'}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Joined</div>
                <div className="text-sm">Jan 1, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/40 shadow-sm">
           <div className="p-4 border-b border-border/40 font-bold">
             More from <span className="text-primary">{authorUser?.name}</span>
           </div>
           <div className="flex flex-col">
             {[1, 2, 3].map(i => (
               <a key={i} className="p-4 border-b border-border/40 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors group">
                 <div className="text-sm group-hover:text-primary transition-colors">How to build a scalable application from scratch part {i}</div>
                 <div className="flex flex-wrap gap-2 mt-2">
                   <span className="text-xs text-muted-foreground">#webdev</span>
                 </div>
               </a>
             ))}
           </div>
        </Card>
      </aside>
    </div>
  );
};
