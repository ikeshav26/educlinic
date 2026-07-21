import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/mockData';
import type { User } from '../types';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfilePostList } from '../components/profile/ProfilePostList';

interface ProfilePageProps {
  userId?: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { currentUser, users, posts, toggleFollow, fetchFollowCounts } = useStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const profileUser: User | null = userId
    ? users.find(u => u.id === userId) || currentUser
    : currentUser;

  const targetId = profileUser?.id;

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
  const userPosts = posts.filter(p =>
    p.author?.id === profileUser.id || p.createdBy?.id === profileUser.id
  );

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
        userPostsCount={userPosts.length}
        onFollowToggle={handleFollowToggle}
      />
      <ProfilePostList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMe={isMe}
        userPosts={userPosts}
      />
    </div>
  );
};
