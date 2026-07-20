import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MessageSquare, Bookmark, Share2, Sparkles, MapPin, Calendar, ArrowLeft, UserCheck } from 'lucide-react';
import { CommentSection } from './Comments/CommentSection.tsx';
import MDEditor from '@uiw/react-md-editor';
import 'react-quill-new/dist/quill.snow.css';
import { isHtml } from '../utils/text';

export const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const { posts, users, toggleLike, toggleFollow, fetchFollowCounts, currentUser } = useStore();

  const [unicorns, setUnicorns] = useState<number>(12);
  const [isUnicorned, setIsUnicorned] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const post = posts.find(p => p.id === postId);

  const authorUser = post?.author
    ? users.find(u => u.id === post.author?.id) || post.author
    : post?.createdBy;

  const authorId = authorUser?.id;
  const isMe = authorId === currentUser?.id;

  const loadFollowState = useCallback(async () => {
    if (!authorId || isMe) return;
    const counts = await fetchFollowCounts(authorId);
    setIsFollowing(counts.isFollowing);
  }, [authorId, isMe, fetchFollowCounts]);

  useEffect(() => {
    loadFollowState();
  }, [loadFollowState]);

  if (!post) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-xl font-bold">Post not found</div>
        <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </Button>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    if (!authorUser || isMe) return;
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    await toggleFollow(authorUser.id, wasFollowing);
    await loadFollowState();
    setFollowLoading(false);
  };

  const isLiked = post.isLiked;
  const likesCount = post._count?.likes ?? post.likes ?? 0;
  const commentsCount = post.comments?.length ?? 0;

  const handleUnicornToggle = () => {
    setIsUnicorned(!isUnicorned);
    setUnicorns(prev => isUnicorned ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-auto w-full max-w-[1240px]">
      <aside className="hidden lg:flex flex-col items-center gap-6 w-14 shrink-0 pt-6 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto text-muted-foreground [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => toggleLike(post.id)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-red-500/10 text-red-500' : 'hover:bg-muted group-hover:text-red-500'}`}>
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </div>
          <span className="text-xs font-semibold">{likesCount}</span>
        </button>

        <button
          onClick={handleUnicornToggle}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full text-xl transition-colors ${isUnicorned ? 'bg-amber-500/10' : 'hover:bg-muted'}`}>
            🦄
          </div>
          <span className="text-xs font-semibold">{unicorns}</span>
        </button>

        <button
          onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 rounded-full hover:bg-muted group-hover:text-[#3b49df] transition-colors">
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">{commentsCount}</span>
        </button>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`p-3 rounded-full transition-colors ${isBookmarked ? 'bg-[#3b49df]/10 text-[#3b49df]' : 'hover:bg-muted group-hover:text-[#3b49df]'}`}>
            <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-[#3b49df]' : ''}`} />
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-3 rounded-full hover:bg-muted group-hover:text-foreground transition-colors">
            <Share2 className="h-6 w-6" />
          </div>
        </button>
      </aside>

      <article className="flex-1 min-w-0 bg-card rounded-md border border-border/80 overflow-hidden shadow-2xs">
        {(post.coverImage || post.imageUrl) && (
          <div
            className="w-full h-64 sm:h-80 md:h-96 bg-muted"
            style={{ backgroundImage: `url(${post.coverImage || post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}

        <div className="p-4 sm:p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60 cursor-pointer" onClick={() => navigate('/profile')}>
                <AvatarImage src={authorUser?.avatar} />
                <AvatarFallback>{authorUser?.name?.substring(0, 2) || 'DEV'}</AvatarFallback>
              </Avatar>
              <div>
                <div
                  className="font-bold text-base text-foreground hover:text-[#3b49df] cursor-pointer transition-colors"
                  onClick={() => navigate('/profile')}
                >
                  {authorUser?.name || 'DEV Contributor'}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Posted on {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 4 min read
                </div>
              </div>
            </div>

            <Button
              onClick={handleFollowToggle}
              disabled={followLoading || isMe}
              size="sm"
              className={`rounded-md font-medium text-sm hidden sm:flex ${
                isMe
                  ? 'hidden'
                  : isFollowing
                  ? 'bg-muted text-foreground border border-border/80 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                  : 'bg-[#3b49df] hover:bg-[#2f3ab2] text-white'
              }`}
            >
              {isFollowing ? <><UserCheck className="h-4 w-4 mr-1" />Following</> : 'Follow'}
            </Button>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">
            {post.title || "Untitled Article"}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-sm text-muted-foreground hover:text-foreground hover:bg-[#3b49df]/10 hover:border-[#3b49df]/30 px-2.5 py-1 rounded transition-colors cursor-pointer border border-transparent font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {isHtml(post.content) ? (
            <div className="ql-snow mt-6 mb-8 w-full max-w-none">
              <div
                className="ql-editor !p-0 font-sans text-foreground leading-relaxed text-base sm:text-lg space-y-4 [&_img]:rounded-md [&_img]:max-h-[500px] [&_img]:mx-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[#3b49df] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ) : (
            <div data-color-mode="light" className="mt-6 mb-8 w-full max-w-none prose-styles">
              <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }} />
            </div>
          )}
        </div>
        <div className="lg:hidden flex items-center justify-around py-3 border-t border-border/60 bg-muted/20 px-4">
          <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className={isLiked ? 'text-red-500' : ''}>
            <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleUnicornToggle}>
            🦄 {unicorns}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
            <MessageSquare className="h-5 w-5 mr-1" /> {commentsCount}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-[#3b49df] text-[#3b49df]' : ''}`} />
          </Button>
        </div>
        <div className="border-t border-border/60">
          <CommentSection postId={post.id} comments={post.comments || []} commentsCount={commentsCount} />
        </div>
      </article>

      <aside className="hidden lg:flex flex-col gap-4 w-80 shrink-0 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs border-t-[32px] border-t-[#3b49df]">
          <div className="p-5">
            <div className="flex items-end gap-3 -mt-10 mb-4">
              <Avatar className="h-16 w-16 border-4 border-card bg-card shadow-xs cursor-pointer" onClick={() => navigate('/profile')}>
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
              onClick={handleFollowToggle}
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

        <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-border/60 font-bold text-sm bg-muted/20">
            More from <span className="text-[#3b49df]">{authorUser?.name || 'Author'}</span>
          </div>
          <div className="divide-y divide-border/40">
            {[
              { title: '10 React Performance Optimizations You Must Know', tag: 'react' },
              { title: 'Understanding TypeScript Generics with Practical Examples', tag: 'typescript' },
              { title: 'How we scaled our API to handle 10M requests/day', tag: 'backend' },
            ].map((item, idx) => (
              <a
                key={idx}
                className="p-4 block hover:bg-muted/40 cursor-pointer transition-colors group"
                onClick={() => navigate('/')}
              >
                <div className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  #{item.tag}
                </div>
              </a>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
};
