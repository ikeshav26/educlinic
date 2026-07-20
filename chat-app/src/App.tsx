import React, { useState } from 'react';
import { StoreProvider } from './store/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { CreatePost } from './components/CreatePost';
import { RightSidebar } from './components/RightSidebar';

import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { PostDetail } from './components/PostDetail';

const Layout = () => {
  const location = useLocation();
  const isCreatePost = location.pathname === '/create-post';
  const isPostDetail = location.pathname.startsWith('/post/');

  return (
    <div className="min-h-screen bg-muted/20 text-foreground overflow-x-hidden flex flex-col">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl px-4 py-6 flex-1 flex justify-center gap-4">
        {/* Left Sidebar: hidden on mobile */}
        {!isCreatePost && !isPostDetail && (
          <Sidebar />
        )}
        
        {/* Main Content Area */}
        <main className={`flex-1 w-full ${isCreatePost ? 'max-w-4xl' : (isPostDetail ? 'max-w-full lg:max-w-[1000px]' : 'max-w-[800px]')}`}>
          <Outlet />
        </main>

        {/* Right Sidebar: hidden on mobile & tablet, only shown on feed */}
        {location.pathname === '/' && !isPostDetail && <RightSidebar />}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Feed />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;