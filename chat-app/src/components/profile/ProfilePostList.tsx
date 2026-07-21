import React, { useState, useEffect, useCallback } from 'react';
import type { Post } from '../../types';
import { FileText, Bookmark, Heart, MessageSquare, Trash2, Loader2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stripHtml } from '../../utils/text';
import { useStore } from '../../store/mockData';
import { Toast } from '../ui/Toast';

type ProfileTab = 'posts' | 'saved';

interface ProfilePostListProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  isMe: boolean;
  profileUserId: number;
  setTotalPosts: (count: number) => void;
}

export const ProfilePostList: React.FC<ProfilePostListProps> = ({
  activeTab,
  setActiveTab,
  isMe,
  profileUserId,
  setTotalPosts,
}) => {
  const navigate = useNavigate();
  const { deletePost } = useStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const fetchPosts = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/posts?authorId=${profileUserId}&page=${pageNum}&limit=5`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => isInitial ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setTotalPosts(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profileUserId, setTotalPosts]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleDelete = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const success = await deletePost(postId);
    if (success) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      setToastMessage('Post deleted successfully');
      setTotalPosts(posts.length - 1);
    }
  };

  return (
    <>
      <div className="flex items-center border-b border-border/60 gap-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 font-semibold text-base transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'posts'
            ? 'border-[#3b49df] text-[#3b49df]'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <FileText className="h-4 w-4" /> Posts
        </button>
        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 font-semibold text-base transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'saved'
              ? 'border-[#3b49df] text-[#3b49df]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <Bookmark className="h-4 w-4" /> Reading List
          </button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5 relative">
        {activeTab === 'posts' && (
          <>
            {posts.length > 0 ? (
              posts.map(post => (
                <div
                  key={post.id}
                  className="bg-card border border-border/80 rounded-md p-5 shadow-2xs hover:border-[#3b49df]/50 cursor-pointer transition-colors relative group"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-extrabold text-foreground hover:text-[#3b49df] transition-colors mb-2 flex-1">
                      {post.title || stripHtml(post.content)}
                    </h3>
                    {isMe && (
                      <div className="relative">
                        <button
                          className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === post.id ? null : post.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenuId === post.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border/60 rounded-md shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={(e) => {
                                  setOpenMenuId(null);
                                  handleDelete(e, post.id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-black hover:text-black/60 cursor-pointer flex items-center gap-2 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {stripHtml(post.content)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-red-500" /> {post._count?.likes ?? 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post._count?.comments ?? 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading && (
              <div className="text-center p-12 bg-card rounded-md border border-dashed border-border/80">
                <p className="text-muted-foreground text-sm">No posts published yet.</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center p-4 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {hasMore && !loading && (
              <div className="flex justify-center mt-6 mb-4">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <div className="text-center p-12 bg-card rounded-md border border-dashed border-border/80">
            <p className="text-muted-foreground text-sm">Your reading list is empty.</p>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          visible={true}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </>
  );
};
