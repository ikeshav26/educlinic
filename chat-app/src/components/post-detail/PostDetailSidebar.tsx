import React from 'react';
import { Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';

interface PostDetailSidebarProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  unicorns: number;
  isUnicorned: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onUnicorn: () => void;
  onBookmark: () => void;
}

export const PostDetailSidebar: React.FC<PostDetailSidebarProps> = ({
  isLiked,
  likesCount,
  commentsCount,
  unicorns,
  isUnicorned,
  isBookmarked,
  onLike,
  onUnicorn,
  onBookmark,
}) => {
  return (
    <aside className="hidden lg:flex flex-col items-center gap-6 w-14 shrink-0 pt-6 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto text-muted-foreground [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1 group cursor-pointer"
      >
        <div className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-red-500/10 text-red-500' : 'hover:bg-muted group-hover:text-red-500'}`}>
          <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </div>
        <span className="text-xs font-semibold">{likesCount}</span>
      </button>

      <button
        onClick={onUnicorn}
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
        onClick={onBookmark}
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
  );
};
