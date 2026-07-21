import React, { useState, useMemo } from 'react';
import { useStore } from '../store/mockData';
import { getAvatarUrl } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, UserCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConnectPage: React.FC = () => {
  const { users, currentUser, toggleFollow } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => user.id !== currentUser?.id)
      .filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [users, currentUser, searchQuery]);

  const handleFollowToggle = async (e: React.MouseEvent, userId: number, isFollowing: boolean) => {
    e.stopPropagation();
    setLoadingIds(prev => new Set(prev).add(userId));
    try {
      await toggleFollow(userId, isFollowing);
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-card border border-border/80 rounded-md p-6 shadow-2xs">
        <h1 className="text-2xl font-extrabold mb-2">Connect with Students</h1>
        <p className="text-muted-foreground mb-6">
          Find and follow other people in the EduClinic community to see their posts in your feed.
        </p>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-base bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-[#3b49df]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => {
          // Using isFollowed from User type
          const isFollowing = user.isFollowed || false;
          const isFollowLoading = loadingIds.has(user.id);

          return (
            <div 
              key={user.id} 
              className="bg-card border border-border/80 rounded-md p-5 flex items-start gap-4 hover:border-[#3b49df]/50 cursor-pointer transition-colors shadow-2xs group"
              onClick={() => navigate(`/profile?id=${user.id}`)}
            >
              <Avatar className="h-14 w-14 border border-border/40 shrink-0">
                <AvatarImage src={getAvatarUrl(user.name, user.avatar)} />
                <AvatarFallback className="bg-muted text-foreground font-semibold">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground group-hover:text-[#3b49df] truncate transition-colors">
                  {user.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">
                  {user.bio || 'Passionate student sharing insights and learning.'}
                </p>
                
                <Button
                  onClick={(e) => handleFollowToggle(e, user.id, isFollowing)}
                  disabled={isFollowLoading}
                  size="sm"
                  className={
                    isFollowing
                      ? 'bg-muted text-foreground hover:bg-red-50 hover:text-red-600 transition-colors h-8'
                      : 'bg-[#3b49df] hover:bg-[#2f3ab2] text-white h-8'
                  }
                >
                  {isFollowing ? (
                    <><UserCheck className="h-3.5 w-3.5 mr-1" /> Following</>
                  ) : (
                    <><UserPlus className="h-3.5 w-3.5 mr-1" /> Follow</>
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-dashed border-border/80 rounded-md">
            No users found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
