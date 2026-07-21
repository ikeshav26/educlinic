import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useStore } from '../../store/mockData';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-4 w-full max-w-[600px]">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <div className="bg-black dark:bg-white text-white dark:text-black font-extrabold text-xl px-2 py-1 rounded shadow-sm">
              BFGI
            </div>
            <span className="hidden sm:inline font-semibold text-lg tracking-tight">Network</span>
          </Link>

          <div className="hidden md:flex relative flex-1 max-w-[400px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 bg-muted/50 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            className="hidden sm:flex text-primary border-primary hover:bg-primary/10"
            onClick={() => navigate('/create-post')}
          >
            Create Post
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};
