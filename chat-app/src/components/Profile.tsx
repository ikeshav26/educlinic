import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { MapPin, Calendar, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface ProfileProps {
  userId?: number; 
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { currentUser, users, posts, toggleFollow } = useStore();
  const navigate = useNavigate();
  
  // If no userId is passed, we show the current user's profile
  const profileUser: User | null = userId 
    ? users.find(u => u.id === userId) || currentUser 
    : currentUser;

  if (!profileUser) return null;

  const isMe = profileUser.id === currentUser?.id;
  const userPosts = posts.filter(p => (p.author?.id === profileUser.id) || (p.createdBy?.id === profileUser.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Profile Header */}
      <div className="bg-background rounded-b-xl shadow-sm border border-t-0 overflow-hidden relative">
        <div 
          className="h-32 sm:h-48 w-full bg-primary/20"
          style={profileUser.coverImage ? { backgroundImage: `url(${profileUser.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background ring-4 ring-background shadow-xl">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback>{profileUser.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              {!isMe && (
                <>
                  <Button onClick={() => navigate('/chat')} variant="secondary">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Button>
                  <Button 
                    onClick={() => toggleFollow(profileUser.id)}
                    variant={profileUser.isFollowed ? "outline" : "default"}
                  >
                    {profileUser.isFollowed ? 'Following' : 'Follow'}
                  </Button>
                </>
              )}
              {isMe && (
                <Button variant="outline">Edit Profile</Button>
              )}
            </div>
          </div>
          <div className="space-y-4 mt-8 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold">{profileUser.name}</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">
              {profileUser.bio || "404 bio not found."}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-muted-foreground text-sm pt-2">
              <span className="flex items-center"><MapPin className="mr-1 h-4 w-4" /> Earth</span>
              <span className="flex items-center"><Calendar className="mr-1 h-4 w-4" /> Joined recently</span>
              <span className="flex items-center hover:text-primary cursor-pointer"><LinkIcon className="mr-1 h-4 w-4" /> dev.to/{profileUser.name.toLowerCase().replace(/\s/g,'')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        {userPosts.length > 0 ? userPosts.map(post => (
          <Card key={post.id} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{post.title || post.content}</h3>
              <p className="text-muted-foreground line-clamp-3 mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post.likes} likes • {post.comments.length} comments</span>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center p-12 bg-muted/30 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
