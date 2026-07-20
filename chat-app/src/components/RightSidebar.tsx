import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useStore } from '../store/mockData';

export const RightSidebar: React.FC = () => {
  const { posts } = useStore();
  const trendingPosts = posts.slice(0, 3); // mock trending

  return (
    <aside className="hidden lg:block w-[300px] h-full pt-4 pl-4 sticky top-14 self-start space-y-4">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold hover:text-primary cursor-pointer transition-colors">#discuss</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Discussion threads targeting the whole community</p>
        </CardHeader>
        <CardContent className="pt-2 px-0">
          {trendingPosts.length > 0 ? trendingPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer px-6 py-4 hover:bg-card rounded-md transition-colors border-b border-border/40 last:border-0">
              <h4 className="text-[15px] text-foreground/90 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {post.title || post.content}
              </h4>
              <p className="text-xs text-muted-foreground mt-2">
                {post.comments.length} comments
              </p>
            </div>
          )) : (
            <div className="text-sm text-muted-foreground px-6 py-4">No discussions yet.</div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-transparent shadow-none border-none mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold hover:text-primary cursor-pointer transition-colors">#watercooler</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Light, non-technical conversations.</p>
        </CardHeader>
        <CardContent className="pt-2 px-0">
           <div className="group cursor-pointer px-6 py-4 hover:bg-card rounded-md transition-colors border-b border-border/40">
              <h4 className="text-[15px] text-foreground/90 group-hover:text-primary transition-colors leading-snug">
                What are you building this weekend?
              </h4>
              <p className="text-xs text-muted-foreground mt-2">12 comments</p>
           </div>
           <div className="group cursor-pointer px-6 py-4 hover:bg-card rounded-md transition-colors border-b border-border/40">
              <h4 className="text-[15px] text-foreground/90 group-hover:text-primary transition-colors leading-snug">
                Music Monday: What are you listening to?
              </h4>
              <p className="text-xs text-muted-foreground mt-2">34 comments</p>
           </div>
        </CardContent>
      </Card>
    </aside>
  );
};
