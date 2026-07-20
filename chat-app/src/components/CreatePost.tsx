import React, { useState, useRef, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useStore } from '../store/mockData';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X } from 'lucide-react';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useStore();
  const quillRef = useRef<ReactQuill>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  const parsedTags = tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;

        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
          const response = await fetch(`${apiUrl}/posts/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            credentials: 'include',
            body: JSON.stringify({ image: base64Image })
          });

          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();

          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, 'image', data.url);
            quill.setSelection(index + 1, 0);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        }
      };
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

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
        <span className="font-bold text-lg text-foreground">Create Article</span>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-card border border-border/80 rounded-md p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a cover image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="bg-muted/30 border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-[#3b49df] flex-1"
            />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button variant="outline" type="button" className="relative z-0">
                Upload
              </Button>
            </div>
          </div>
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

        <div className="mt-4 mb-8">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="bg-background min-h-[400px] border border-border/80 rounded-md [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/80 [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:border-none [&_.ql-container]:text-base [&_.ql-editor]:min-h-[350px] [&_.ql-toolbar]:bg-muted/30"
            placeholder="Write your post content here..."
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
    </div>
  );
};
