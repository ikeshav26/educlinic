import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/mockData';
import { getAvatarUrl } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, UserCheck, UserPlus, RefreshCw, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConnectUser {
  id: number;
  name: string;
  email: string;
  role: string;
  schoolCategory: string | null;
  isFollowed: boolean;
  avatar?: string;
  bio?: string;
}

export const ConnectPage: React.FC = () => {
  const { toggleFollow, startDirectMessage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState<ConnectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setSkip(0); // reset skip on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/users?limit=16&skip=${skip}&search=${encodeURIComponent(debouncedSearch)}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, skip]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefreshPeople = () => {
    // If we reach the end, cycle back to 0
    if (skip + 16 >= total && total > 0) {
      setSkip(0);
    } else {
      setSkip(prev => prev + 16);
    }
  };

  const handleFollowToggle = async (e: React.MouseEvent, userId: number, isFollowing: boolean) => {
    e.stopPropagation();
    setLoadingIds(prev => new Set(prev).add(userId));
    try {
      await toggleFollow(userId, isFollowing);
      // Optimistic UI update
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFollowed: !isFollowing } : u));
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Connect with Students</h1>
            <p className="text-muted-foreground text-sm">
              Discover and follow peers from various schools and departments.
            </p>
          </div>
          <Button onClick={handleRefreshPeople} variant="outline" className="gap-2 rounded-md">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh People
          </Button>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-base bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-[#3b49df]"
          />
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-card border border-border/80 rounded-md overflow-hidden relative flex flex-col h-[280px]">
              {/* Banner Skeleton */}
              <div className="h-20 bg-muted/60 animate-pulse w-full shrink-0" />

              {/* Avatar Skeleton */}
              <div className="absolute top-10 left-4">
                <div className="h-20 w-20 rounded-full border-4 border-card bg-muted/60 animate-pulse" />
              </div>

              {/* Content Skeleton */}
              <div className="pt-12 px-5 pb-5 flex-1 flex flex-col">
                <div className="h-6 bg-muted/60 rounded animate-pulse w-1/2 mb-1" />
                <div className="h-4 bg-muted/60 rounded animate-pulse w-1/3 mb-4" />

                <div className="space-y-2 mb-4 flex-1 mt-1">
                  <div className="h-4 bg-muted/60 rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted/60 rounded animate-pulse w-4/5" />
                </div>

                <div className="h-10 bg-muted/60 rounded-full animate-pulse w-full shrink-0 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(user => {
            const isFollowing = user.isFollowed;
            const isFollowLoading = loadingIds.has(user.id);

            return (
              <div
                key={user.id}
                className="bg-card border border-border/80 rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col relative"
                onClick={() => navigate(`/profile?id=${user.id}`)}
              >
                {/* Black Banner */}
                <div className="h-20 bg-[#1a1a1a] w-full" />

                {/* Avatar (Overlapping) */}
                <div className="absolute top-10 left-4">
                  <Avatar className="h-20 w-20 border-4 border-card bg-card">
                    <AvatarImage src={getAvatarUrl(user.name, user.avatar)} />
                    <AvatarFallback className="bg-muted text-xl font-bold">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="pt-12 px-5 pb-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-foreground hover:text-[#3b49df] truncate transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {user.schoolCategory?.replace(/_/g, ' ') || 'Student at EduClinic'}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 flex-1">
                    {user.bio || 'Passionate student sharing insights and learning.'}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => handleFollowToggle(e, user.id, isFollowing)}
                      disabled={isFollowLoading}
                      className={
                        isFollowing
                          ? 'bg-muted text-foreground border border-border/80 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors flex-1 rounded-full'
                          : 'bg-[#3b49df] hover:bg-[#2f3ab2] text-white flex-1 rounded-full'
                      }
                    >
                      {isFollowing ? (
                        <><UserCheck className="h-4 w-4 mr-1.5" /> Following</>
                      ) : (
                        <><UserPlus className="h-4 w-4 mr-1.5" /> Follow</>
                      )}
                    </Button>

                  </div>
                </div>
              </div>
            );
          })}

          {!loading && users.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-card border border-dashed border-border/80 rounded-md">
              No users found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
