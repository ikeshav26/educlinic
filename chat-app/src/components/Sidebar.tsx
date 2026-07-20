import React from 'react';
import { 
  Home, 
  MessageSquare, 
  User as UserIcon, 
  Bookmark, 
  Hash, 
  HelpCircle, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  BookOpen,
  Heart,
  Code2
} from 'lucide-react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/mockData';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useStore();

  const mainNavItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Direct Messages', icon: MessageSquare, path: '/chat' },
    { name: 'My Profile', icon: UserIcon, path: '/profile' },
    { name: 'Reading List', icon: Bookmark, path: '/' },
  ];

  const secondaryItems = [
    { name: 'Tags', icon: Hash },
    { name: 'FAQ / Help', icon: HelpCircle },
    { name: 'DEV Showcase', icon: Sparkles },
    { name: 'About DEV', icon: Info },
    { name: 'Code of Conduct', icon: ShieldCheck },
    { name: 'Guides & Docs', icon: BookOpen },
  ];

  const popularTags = [
    { name: 'webdev', count: '142k' },
    { name: 'javascript', count: '98k' },
    { name: 'react', count: '64k' },
    { name: 'python', count: '52k' },
    { name: 'ai', count: '39k' },
    { name: 'beginners', count: '81k' },
    { name: 'css', count: '45k' },
  ];

  return (
    <aside className="hidden md:block w-[240px] shrink-0 pt-1 pr-2 sticky top-16 self-start max-h-[calc(100vh-4.5rem)] overflow-y-auto space-y-5 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* DEV Community Callout Card */}
      {!currentUser && (
        <div className="bg-card border border-border/80 rounded-md p-4 space-y-3 shadow-2xs">
          <h2 className="font-bold text-base leading-tight">
            DEV Community is a community of 1,800,000+ amazing developers
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We're a place where coders share, stay up-to-date and grow their careers.
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

      {/* Main Navigation */}
      <nav className="flex flex-col space-y-0.5">
        {mainNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              className={`justify-start w-full font-normal h-10 px-3 hover:bg-[#3b49df]/10 hover:text-[#3b49df] transition-colors rounded-md ${
                isActive ? 'font-bold bg-[#3b49df]/10 text-[#3b49df]' : 'text-foreground/90'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
              <span className="truncate">{item.name}</span>
            </Button>
          );
        })}
      </nav>

      {/* Secondary Items */}
      <div className="pt-2">
        <h3 className="mb-2 px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Other</h3>
        <nav className="flex flex-col space-y-0.5">
          {secondaryItems.map(item => (
            <Button 
              key={item.name}
              variant="ghost" 
              className="justify-start w-full font-normal h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
            >
              <item.icon className="mr-3 h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Popular Tags Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between px-3 mb-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Popular Tags</h3>
        </div>
        <div className="flex flex-col space-y-0.5">
          {popularTags.map(tag => (
            <a 
              key={tag.name}
              href={`#${tag.name}`}
              className="flex items-center justify-between px-3 py-1.5 rounded-md text-foreground/80 hover:text-[#3b49df] hover:bg-[#3b49df]/10 transition-colors group cursor-pointer"
            >
              <span className="font-mono text-sm group-hover:underline">#{tag.name}</span>
              <span className="text-xs text-muted-foreground">{tag.count}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-3 pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-2 leading-relaxed">
        <p className="flex items-center gap-1">
          <Code2 className="h-3.5 w-3.5 text-[#3b49df]" />
          <span>DEV Community &copy; {new Date().getFullYear()}</span>
        </p>
        <p>Built on Forem — the open source software that powers DEV and other inclusive communities.</p>
      </div>
    </aside>
  );
};
