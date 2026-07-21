import React from 'react';
import type { User } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { MapPin, Calendar, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostAuthorCardProps {
  authorUser: User | undefined;
  isMe: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowToggle: () => void;
}

export const PostAuthorCard: React.FC<PostAuthorCardProps> = ({
  authorUser,
  isMe,
  isFollowing,
  followLoading,
  onFollowToggle,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs border-t-[32px] border-t-[#3b49df]">
      <div className="p-5">
        <div className="flex items-end gap-3 -mt-10 mb-4">
          <Avatar
            className="h-16 w-16 border-4 border-card bg-card shadow-xs cursor-pointer"
            onClick={() => navigate('/profile')}
          >
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

        <Button
          onClick={onFollowToggle}
          disabled={followLoading || isMe}
          className={`w-full font-medium mb-4 rounded-md ${
            isMe
              ? 'hidden'
              : isFollowing
              ? 'bg-muted text-foreground border border-border/80 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
              : 'bg-[#3b49df] hover:bg-[#2f3ab2] text-white'
          }`}
        >
          {isFollowing ? <><UserCheck className="h-4 w-4 mr-1" />Following</> : 'Follow'}
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
  );
};
