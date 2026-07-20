import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useStore } from '../store/mockData';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  const handlePublish = () => {
    if (title.trim() && content.trim()) {
      addPost(
        title, 
        content, 
        coverImage, 
        tags.split(',').map(t => t.trim()).filter(Boolean)
      );
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
      </div>
      <Card className="p-6 space-y-6 border-none shadow-sm">
        <div className="space-y-4">
          <Input 
            placeholder="Add a cover image URL..." 
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <Input 
            placeholder="New post title here..." 
            className="text-4xl font-bold h-auto py-2 px-0 border-none shadow-none focus-visible:ring-0 rounded-none placeholder:text-muted-foreground/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input 
            placeholder="Add up to 4 tags (comma separated)..." 
            className="border-none shadow-none px-0 focus-visible:ring-0"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="bg-muted/50 rounded-lg p-2 border border-border flex gap-2">
          {/* Mock Toolbar */}
          <Button variant="ghost" size="sm" className="h-8 px-2 font-bold">B</Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 italic">I</Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 underline">U</Button>
          <div className="w-px h-6 bg-border mx-2 self-center"></div>
          <Button variant="ghost" size="sm" className="h-8 px-2">🔗</Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">📷</Button>
        </div>
        <Textarea 
          placeholder="Write your post content here... (Supports Markdown)" 
          className="min-h-[400px] border-none shadow-none focus-visible:ring-0 text-lg resize-y px-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="pt-4 flex gap-4">
          <Button onClick={handlePublish} disabled={!title.trim() || !content.trim()}>Publish</Button>
          <Button variant="secondary">Save draft</Button>
        </div>
      </Card>
    </div>
  );
};
