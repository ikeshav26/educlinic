import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/mockData';
import type { User } from '../types';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfilePostList } from '../components/profile/ProfilePostList';
import { useSearchParams } from 'react-router-dom';

interface ProfilePageProps {
  userId?: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId: propsUserId }) => {
  const { currentUser, toggleFollow, fetchFollowCounts } = useStore();
  const [searchParams] = useSearchParams();
  const urlUserId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : undefined;
  
  const targetId = propsUserId || urlUserId || currentUser?.id;

  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (targetId && targetId !== currentUser?.id) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
          const res = await fetch(`${apiUrl}/users/${targetId}`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setFetchedUser(data.user);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setFetchedUser(null);
      }
    };
    fetchUser();
  }, [targetId, currentUser]);

  const profileUser: User | null = (targetId === currentUser?.id) ? currentUser : fetchedUser;

  const loadCounts = useCallback(async () => {
    if (!targetId) return;
    const counts = await fetchFollowCounts(targetId);
    setFollowersCount(counts.followersCount);
    setFollowingCount(counts.followingCount);
    setIsFollowing(counts.isFollowing);
  }, [targetId, fetchFollowCounts]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  if (!profileUser) return null;

  const isMe = profileUser.id === currentUser?.id;

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowersCount(c => wasFollowing ? c - 1 : c + 1);
    await toggleFollow(profileUser.id, wasFollowing);
    await loadCounts();
    setFollowLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <ProfileHeader
        profileUser={profileUser}
        isMe={isMe}
        isFollowing={isFollowing}
        followLoading={followLoading}
        followersCount={followersCount}
        followingCount={followingCount}
        userPostsCount={totalPosts}
        onFollowToggle={handleFollowToggle}
      />
      <ProfilePostList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMe={isMe}
        profileUserId={profileUser.id}
        setTotalPosts={setTotalPosts}
      />
    </div>
  );
};
