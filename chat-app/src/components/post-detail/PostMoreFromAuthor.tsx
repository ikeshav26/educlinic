import React from 'react';
import type { User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface PostMoreFromAuthorProps {
  authorUser: User | undefined;
}

const MORE_POSTS = [
  { title: '10 React Performance Optimizations You Must Know', tag: 'react' },
  { title: 'Understanding TypeScript Generics with Practical Examples', tag: 'typescript' },
  { title: 'How we scaled our API to handle 10M requests/day', tag: 'backend' },
];

export const PostMoreFromAuthor: React.FC<PostMoreFromAuthorProps> = ({ authorUser }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-border/60 font-bold text-sm bg-muted/20">
        More from <span className="text-[#3b49df]">{authorUser?.name || 'Author'}</span>
      </div>
      <div className="divide-y divide-border/40">
        {MORE_POSTS.map((item, idx) => (
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
  );
};
