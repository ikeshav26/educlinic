import React from 'react';
import type { Post } from '../../types';
import MDEditor from '@uiw/react-md-editor';
import 'react-quill-new/dist/quill.snow.css';
import { isHtml } from '../../utils/text';

interface PostContentProps {
  post: Post;
}

export const PostContent: React.FC<PostContentProps> = ({ post }) => {
  return (
    <>
      {(post.coverImage || post.imageUrl) && (
        <div
          className="w-full h-64 sm:h-80 md:h-96 bg-muted"
          style={{ backgroundImage: `url(${post.coverImage || post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      <div className="p-4 sm:p-8 md:px-12 md:pt-12">
        <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">
          {post.title || 'Untitled Article'}
        </h1>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-[#3b49df]/10 hover:border-[#3b49df]/30 px-2.5 py-1 rounded transition-colors cursor-pointer border border-transparent font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {isHtml(post.content) ? (
          <div className="ql-snow mt-6 mb-8 w-full max-w-none">
            <div
              className="ql-editor !p-0 font-sans text-foreground leading-relaxed text-base sm:text-lg space-y-4 [&_img]:rounded-md [&_img]:max-h-[500px] [&_img]:mx-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[#3b49df] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        ) : (
          <div data-color-mode="light" className="mt-6 mb-8 w-full max-w-none prose-styles">
            <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }} />
          </div>
        )}
      </div>
    </>
  );
};
