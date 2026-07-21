import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useStore } from '../store/mockData';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { CoverImageUpload } from '../components/create-post/CoverImageUpload';
import { PostEditor } from '../components/create-post/PostEditor';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  const parsedTags = tags
    ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (title.trim() && content.trim()) {
      addPost(title, content, coverImage, parsedTags);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-4">
      <div className="flex items-center justify-between bg-card border border-border/80 rounded-md p-3 px-4 shadow-2xs">
        <span className="font-bold text-lg text-foreground">Create Article</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-card border border-border/80 rounded-md p-6 sm:p-8 space-y-6 shadow-2xs">
        <CoverImageUpload
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          onFileUpload={handleImageUpload}
        />

        <Input
          placeholder="New post title here..."
          className="text-3xl sm:text-4xl font-extrabold h-auto py-2 px-0 border-none shadow-none focus-visible:ring-0 rounded-none placeholder:text-muted-foreground/40 text-foreground"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="border-b border-border/40 pb-4">
          <Input
            placeholder="Add up to 4 tags (comma separated)... e.g. webdev, javascript, react"
            className="border-none shadow-none px-0 focus-visible:ring-0 text-sm font-mono text-muted-foreground placeholder:text-muted-foreground/50"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {parsedTags.map(tag => (
                <span key={tag} className="text-xs bg-[#3b49df]/10 text-[#3b49df] px-2 py-0.5 rounded font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <PostEditor content={content} onChange={setContent} />

        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim()}
              className="bg-[#3b49df] hover:bg-[#2f3ab2] text-white font-medium px-6 rounded-md shadow-xs"
            >
              Publish
            </Button>
            <Button variant="secondary" className="rounded-md">Save draft</Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setTitle(''); setContent(''); setCoverImage(''); setTags(''); }}
            className="text-muted-foreground"
          >
            Revert changes
          </Button>
        </div>
      </div>
    </div>
  );
};
