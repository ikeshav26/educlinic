import React from 'react';
import { Home, MessageSquare, User as UserIcon, Hash, BookOpen, Video, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Messages', icon: MessageSquare, path: '/chat' },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
  ];

  const secondaryItems = [
    { name: 'Tags', icon: Hash },
    { name: 'Guides', icon: BookOpen },
    { name: 'Videos', icon: Video },
    { name: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:block w-64 h-full pt-4 pr-4 sticky top-14 self-start space-y-6">
      <nav className="flex flex-col space-y-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              className={`justify-start w-full font-normal hover:bg-primary/10 hover:text-primary transition-colors ${isActive ? 'font-semibold bg-transparent' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <div className="pt-6">
        <h3 className="mb-2 px-4 text-base font-bold text-foreground">Other</h3>
        <nav className="flex flex-col space-y-0.5">
          {secondaryItems.map(item => (
            <Button 
              key={item.name}
              variant="ghost" 
              className="justify-start w-full font-normal text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5" strokeWidth={1.5} />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
