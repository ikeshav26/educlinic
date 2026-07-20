import React, { useState } from 'react';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MapPin, Calendar, Link as LinkIcon, MessageSquare, Heart, Bookmark, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface ProfileProps {
  userId?: number; 
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { currentUser, users, posts, toggleFollow } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  
  const profileUser: User | null = userId 
    ? users.find(u => u.id === userId) || currentUser 
    : currentUser;

  if (!profileUser) return null;

  const isMe = profileUser.id === currentUser?.id;
  const userPosts = posts.filter(p => (p.author?.id === profileUser.id) || (p.createdBy?.id === profileUser.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* DEV.to Profile Card Header */}
      <div className="bg-card border border-border/80 rounded-md shadow-2xs overflow-hidden">
        {/* Top Banner */}
        <div 
          className="h-36 sm:h-48 w-full bg-[#3b49df] relative"
          style={profileUser.coverImage ? { backgroundImage: `url(${profileUser.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        
        <div className="px-6 pb-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card ring-2 ring-border/40 shadow-md bg-card shrink-0">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback>{profileUser.name.substring(0,2)}</AvatarFallback>
            </Avatar>

            <div className="flex gap-2 shrink-0">
              {!isMe && (
                <>
                  <Button onClick={() => navigate('/chat')} variant="outline" className="border-border/80 gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                  <Button 
                    onClick={() => toggleFollow(profileUser.id)}
                    className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white font-medium"
                  >
                    {profileUser.isFollowed ? 'Following' : 'Follow'}
                  </Button>
                </>
              )}
              {isMe && (
                <Button variant="outline" className="border-border/80 font-medium">Edit Profile</Button>
              )}
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left mt-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{profileUser.name}</h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              {profileUser.bio || "404 bio not found. Passionate developer sharing technical insights, code snippets, and software engineering practices."}
            </p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-muted-foreground text-xs sm:text-sm pt-2">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#3b49df]" /> San Francisco, CA</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#3b49df]" /> Joined Jan 2024</span>
              <a href="#" className="flex items-center gap-1.5 hover:text-[#3b49df] transition-colors"><LinkIcon className="h-4 w-4" /> dev.to/{profileUser.name.toLowerCase().replace(/\s/g,'')}</a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 border-t border-border/60 mt-6 pt-4 text-center">
            <div>
              <div className="text-xl font-bold text-foreground">{userPosts.length}</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Posts published</div>
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">148</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Reactions given</div>
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Tags followed</div>
            </div>
          </div>
        </div>
      </div>

      {/* DEV.to Profile Tabs */}
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

      {/* Posts Section */}
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
                  {post.title || post.content}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {post.content}
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
    </div>
  );
};
