import React from 'react';
import { useStore } from '../../store/mockData';
import { MessageSquare, HelpCircle, Coffee } from 'lucide-react';
import { stripHtml } from '../../utils/text';

export const RightSidebar: React.FC = () => {
  const { posts } = useStore();
  const trendingPosts = posts.slice(0, 3);

  return (
    <aside className="hidden lg:block w-[320px] shrink-0 pt-1 pl-2 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto space-y-4 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2 font-bold text-base text-foreground hover:text-[#3b49df] cursor-pointer transition-colors">
            <MessageSquare className="h-4 w-4 text-[#3b49df]" />
            <span>#discuss</span>
          </div>
          <span className="text-xs text-muted-foreground">Community</span>
        </div>
        <div className="divide-y divide-border/40">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors"
              >
                <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
                  {post.title || stripHtml(post.content)}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <span>{post.comments.length} comments</span>
                  {post.tags && post.tags[0] && (
                    <>
                      <span>•</span>
                      <span className="text-muted-foreground">#{post.tags[0]}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground p-4">No active discussions right now.</div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2 font-bold text-base text-foreground hover:text-[#3b49df] cursor-pointer transition-colors">
            <Coffee className="h-4 w-4 text-amber-500" />
            <span>#watercooler</span>
          </div>
          <span className="text-xs text-muted-foreground">Relax</span>
        </div>
        <div className="divide-y divide-border/40">
          <div className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors">
            <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
              What are you building or hacking on this weekend?
            </h4>
            <p className="text-xs text-muted-foreground mt-2">24 comments</p>
          </div>
          <div className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors">
            <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
              Music Monday: What track is keeping you in the flow? 🎧
            </h4>
            <p className="text-xs text-muted-foreground mt-2">48 comments</p>
          </div>
          <div className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors">
            <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
              Which developer tool can you absolutely not live without?
            </h4>
            <p className="text-xs text-muted-foreground mt-2">19 comments</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2 font-bold text-base text-foreground hover:text-[#3b49df] cursor-pointer transition-colors">
            <HelpCircle className="h-4 w-4 text-emerald-600" />
            <span>#explainlikeimfive</span>
          </div>
        </div>
        <div className="divide-y divide-border/40">
          <div className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors">
            <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
              Explain Docker containers to me like I'm 5 years old
            </h4>
            <p className="text-xs text-muted-foreground mt-2">31 comments</p>
          </div>
          <div className="group cursor-pointer p-4 hover:bg-muted/40 transition-colors">
            <h4 className="text-sm font-medium text-foreground group-hover:text-[#3b49df] transition-colors leading-snug">
              What is WebAssembly and why should I care?
            </h4>
            <p className="text-xs text-muted-foreground mt-2">15 comments</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
