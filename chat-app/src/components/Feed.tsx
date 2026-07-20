import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Heart, MessageCircle, BookmarkPlus } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const Feed: React.FC = () => {
  const { posts, users, currentUser, toggleLike, addComment } = useStore();
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

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-4">
      {posts.map(post => {
        const authorUser = post.author ? users.find(u => u.id === post.author?.id) || post.author : post.createdBy;
        
        return (
          <Card key={post.id} className="overflow-hidden shadow-sm border border-border/40 bg-card hover:ring-1 hover:ring-primary/20 transition-all">
            {(post.coverImage || post.imageUrl) && (
              <div 
                className="w-full h-48 sm:h-64 bg-muted cursor-pointer"
                style={{ backgroundImage: `url(${post.coverImage || post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => navigate(`/post/${post.id}`)}
              />
            )}
            
            <CardHeader className="pb-2 pt-6 px-4 sm:px-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={authorUser?.avatar} />
                  <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm hover:text-primary cursor-pointer transition-colors">
                    {authorUser?.name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <h2 
                className="text-2xl sm:text-3xl font-bold cursor-pointer hover:text-primary transition-colors leading-tight"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.title || "Untitled Post"}
              </h2>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-sm text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors px-2 py-1 rounded-md border border-transparent hover:border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>

            {/* Optional preview text if no title is present, but usually dev.to shows full content on click. We'll show a snippet. */}
            <CardContent className="px-4 sm:px-6">
              <p className="line-clamp-3 text-foreground/90 leading-relaxed text-lg">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col border-t-0 px-4 sm:px-6 pb-6 pt-2">
              <div className="flex w-full justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center gap-2 hover:bg-red-50 hover:text-red-600 ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{post.likes}</span>
                    <span className="sm:hidden">{post._count?.likes ?? post.likes ?? 0 > 0 ? (post._count?.likes ?? post.likes) : ''}</span>
                    <span className="hidden sm:inline">Likes</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">{post.comments.length}</span>
                    <span className="sm:hidden">{post.comments.length > 0 ? post.comments.length : ''}</span>
                    <span className="hidden sm:inline">Comments</span>
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-primary/10 hover:text-primary">
                  <BookmarkPlus className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="w-full space-y-4 pt-6 border-t mt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback>{currentUser?.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input 
                        placeholder="Add to the discussion" 
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleComment(post.id);
                        }}
                      />
                      <Button onClick={() => handleComment(post.id)}>Submit</Button>
                    </div>
                  </div>
                  <div className="space-y-4 mt-6">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/40 p-4 rounded-xl rounded-tl-none border border-border/50">
                          <div className="font-semibold text-sm mb-1">{comment.author.name}</div>
                          <div className="text-sm text-foreground/90 leading-relaxed">{comment.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
