import React from 'react';
import type { User } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { MapPin, Calendar, Link as LinkIcon, MessageSquare, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  profileUser: User;
  isMe: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  followersCount: number;
  followingCount: number;
  userPostsCount: number;
  onFollowToggle: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUser,
  isMe,
  isFollowing,
  followLoading,
  followersCount,
  followingCount,
  userPostsCount,
  onFollowToggle,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/80 rounded-md shadow-2xs overflow-hidden">
      <div
        className="h-36 sm:h-48 w-full bg-[#3b49df] relative"
        style={profileUser.coverImage ? { backgroundImage: `url(${profileUser.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />

      <div className="px-6 pb-6 relative pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card ring-2 ring-border/40 shadow-md bg-card shrink-0">
            <AvatarImage src={profileUser.avatar} />
            <AvatarFallback>{profileUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex gap-2 shrink-0">
            {!isMe && (
              <>
                <Button onClick={() => navigate('/chat')} variant="outline" className="border-border/80 gap-2">
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button
                  onClick={onFollowToggle}
                  disabled={followLoading}
                  className={
                    isFollowing
                      ? 'bg-muted text-foreground border border-border/80 hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-medium transition-colors'
                      : 'bg-[#3b49df] hover:bg-[#2f3ab2] text-white font-medium'
                  }
                >
                  {isFollowing ? (
                    <><UserCheck className="h-4 w-4 mr-1" /> Following</>
                  ) : (
                    'Follow'
                  )}
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
            {profileUser.bio || '404 bio not found. Passionate developer sharing technical insights, code snippets, and software engineering practices.'}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-muted-foreground text-xs sm:text-sm pt-2">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#3b49df]" /> San Francisco, CA</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#3b49df]" /> Joined Jan 2024</span>
            <a href="#" className="flex items-center gap-1.5 hover:text-[#3b49df] transition-colors">
              <LinkIcon className="h-4 w-4" /> dev.to/{profileUser.name.toLowerCase().replace(/\s/g, '')}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border/60 mt-6 pt-4 text-center">
          <div>
            <div className="text-xl font-bold text-foreground">{userPostsCount}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Posts published</div>
          </div>
          <div className="cursor-pointer hover:text-[#3b49df] transition-colors group">
            <div className="text-xl font-bold text-foreground group-hover:text-[#3b49df] flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />{followersCount}
            </div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Followers</div>
          </div>
          <div className="cursor-pointer hover:text-[#3b49df] transition-colors group">
            <div className="text-xl font-bold text-foreground group-hover:text-[#3b49df] flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />{followingCount}
            </div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};
