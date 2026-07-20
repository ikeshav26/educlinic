import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useStore } from '../store/mockData';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Eye, Edit3, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  const parsedTags = tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [];

  const handlePublish = () => {
    if (title.trim() && content.trim()) {
      addPost(
        title,
        content,
        coverImage,
        parsedTags
      );
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-4">
      <div className="flex items-center justify-between bg-card border border-border/80 rounded-md p-3 px-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-foreground">Create Article</span>
          <div className="flex bg-muted/60 p-1 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('edit')}
              className={`h-8 text-xs font-semibold px-3 rounded-md transition-colors ${activeTab === 'edit' ? 'bg-card text-[#3b49df] shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('preview')}
              className={`h-8 text-xs font-semibold px-3 rounded-md transition-colors ${activeTab === 'preview' ? 'bg-card text-[#3b49df] shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {activeTab === 'edit' ? (
        <div className="bg-card border border-border/80 rounded-md p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-2">
            <Input
              placeholder="Add a cover image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="bg-muted/30 border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-[#3b49df]"
            />
            {coverImage && (
              <div
                className="w-full h-40 rounded-md bg-muted bg-cover bg-center border border-border/60"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
            )}
          </div>

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

          <div data-color-mode="light" className="mt-4 mb-8">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={400}
              preview="live"
              textareaProps={{
                placeholder: 'Write your post content here... (Supports Markdown)'
              }}
            />
          </div>

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
            <Button variant="ghost" size="sm" onClick={() => { setTitle(''); setContent(''); setCoverImage(''); setTags(''); }} className="text-muted-foreground">
              Revert changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-md overflow-hidden p-6 sm:p-10 shadow-2xs space-y-6">
          {coverImage && (
            <div
              className="w-full h-64 rounded-md bg-muted bg-cover bg-center mb-6"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          )}

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/60">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>{currentUser?.name?.substring(0, 2) || 'DEV'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-sm">{currentUser?.name || 'DEV User'}</div>
              <div className="text-xs text-muted-foreground">Preview Mode</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight tracking-tight">
            {title || "Untitled Post"}
          </h1>

          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedTags.map(tag => (
                <span key={tag} className="text-sm font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/40">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap border-t border-border/60 pt-6">
            {content || "No content written yet."}
          </div>
        </div>
      )}
    </div>
  );
};
