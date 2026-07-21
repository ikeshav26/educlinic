import React from 'react';
import {
  Home,
  MessageSquare,
  User as UserIcon,
  Bookmark,
  Users,
  Code2
} from 'lucide-react';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/mockData';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useStore();

  const mainNavItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Connect', icon: Users, path: '/connect' },
    { name: 'Direct Messages', icon: MessageSquare, path: '/chat' },
    { name: 'My Profile', icon: UserIcon, path: '/profile' },
  ];

  const popularTags = [
    'campus',
    'events',
    'coding',
    'sports',
    'placements',
    'hackathon',
    'clubs',
    'interview',
    'experience',
    'roadmap',
    'information',
    'ai',
    'discussions',
    'projects',
    'internships',
    'research',
    'opportunities',
    'help',
    'announcements'
  ];

  return (
    <aside className="hidden md:block w-[240px] shrink-0 pt-1 pr-2 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto space-y-5 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {!currentUser && (
        <div className="bg-card border border-border/80 rounded-md p-4 space-y-3 shadow-2xs">
          <h2 className="font-bold text-base leading-tight">
            EduClinic is our college's internal community
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A place for students to connect, share resources, and grow together.
          </p>
          <div className="space-y-2 pt-1">
            <Button className="w-full bg-[#3b49df] hover:bg-[#2f3ab2] text-white font-medium shadow-xs" size="sm">
              Create account
            </Button>
            <Button variant="ghost" className="w-full text-foreground hover:bg-muted" size="sm">
              Log in
            </Button>
          </div>
        </div>
      )}

      <nav className="flex flex-col space-y-0.5">
        {mainNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`justify-start w-full font-normal h-10 px-3 hover:bg-[#3b49df]/10 hover:text-[#3b49df] transition-colors rounded-md ${isActive ? 'font-bold bg-[#3b49df]/10 text-[#3b49df]' : 'text-foreground/90'
                }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
              <span className="truncate">{item.name}</span>
            </Button>
          );
        })}
      </nav>

      <div className="pt-2">
        <div className="flex items-center justify-between px-3 mb-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trending Topics</h3>
        </div>
        <div className="flex flex-col space-y-0.5">
          {popularTags.map(tag => (
            <div
              key={tag}
              onClick={() => navigate(`/?tag=${tag}`)}
              className="flex items-center justify-between px-3 py-1.5 rounded-md text-foreground/80 hover:text-[#3b49df] hover:bg-[#3b49df]/10 transition-colors group cursor-pointer"
            >
              <span className="font-mono text-sm group-hover:underline">#{tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-2 leading-relaxed">
        <p className="flex items-center gap-1">
          <Code2 className="h-3.5 w-3.5 text-[#3b49df]" />
          <span>EduClinic &copy; {new Date().getFullYear()}</span>
        </p>
        <p>Built for our college community.</p>
      </div>
    </aside>
  );
};
