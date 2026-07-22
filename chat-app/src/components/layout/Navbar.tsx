import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getAvatarUrl } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useStore } from '../../store/mockData';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    if (!isTyping) return;

    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.has('search')) {
          navigate('/');
        }
      }
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, isTyping, navigate]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-4 w-full max-w-[600px]">
          <Link
            to="/"
            className="flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-center rounded-md overflow-hidden">
              <img
                src="/logo1.png"
                alt="BFGI Logo"
                className="h-9 w-auto object-contain grayscale brightness-50"
              />
            </div>
          </Link>

          <div className="hidden md:flex relative flex-1 max-w-[400px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-9 bg-muted/50 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsTyping(true);
              }}
              onKeyDown={handleSearch}
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

          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              <AvatarImage src={getAvatarUrl(currentUser?.name, currentUser?.avatar)} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};
