import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    let finalImageUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      try {
        const cloudinaryUpload = await cloudinary.uploader.upload(imageUrl, {
          folder: 'posts',
        });
        finalImageUrl = cloudinaryUpload.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Image upload failed', error });
        return;
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: finalImageUrl,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({ ...post, comments: [], isLiked: false });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
        ...(userId && {
          likes: {
            where: { userId },
          },
        }),
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      isLiked: userId ? post.likes && post.likes.length > 0 : false,
      likes: undefined,
      comments: post.comments || [],
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) {
      res.status(400).json({ message: 'Post ID is required' });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        _count: {
          select: { likes: true },
        },
        ...(userId && {
          likes: {
            where: { userId },
          },
        }),
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
            ...(userId && {
              likes: { where: { userId } },
            }),
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                author: { select: { id: true, name: true } },
                _count: { select: { likes: true } },
                ...(userId && {
                  likes: { where: { userId } },
                }),
              },
            },
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const formatComment = (comment: any) => ({
      ...comment,
      isLiked: userId ? comment.likes && comment.likes.length > 0 : false,
      likes: undefined,
      replies: comment.replies ? comment.replies.map(formatComment) : undefined,
    });

    const formattedPost = {
      ...post,
      isLiked: userId ? post.likes && post.likes.length > 0 : false,
      likes: undefined,
      comments: post.comments.map(formatComment),
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const togglePostLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!id) {
      res.status(400).json({ message: 'Post ID is required' });
      return;
    }

    const postId = parseInt(id as string);

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      res.status(200).json({ message: 'Post unliked' });
    } else {
      await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });
      res.status(201).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { content, parentId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!id || !content) {
      res.status(400).json({ message: 'Post ID and content are required' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(id as string),
        authorId: userId,
        parentId: parentId ? parseInt(parentId as string) : null,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleCommentLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { commentId } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!commentId) {
      res.status(400).json({ message: 'Comment ID is required' });
      return;
    }

    const parsedCommentId = parseInt(commentId as string);

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId: parsedCommentId,
        },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId: parsedCommentId,
          },
        },
      });
      res.status(200).json({ message: 'Comment unliked' });
    } else {
      await prisma.commentLike.create({
        data: {
          userId,
          commentId: parsedCommentId,
        },
      });
      res.status(201).json({ message: 'Comment liked' });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { image } = req.body;
    if (!image) {
      res.status(400).json({ message: 'Image data is required' });
      return;
    }

    const cloudinaryUpload = await cloudinary.uploader.upload(image, {
      folder: 'editor_images',
    });

    res.status(200).json({ url: cloudinaryUpload.secure_url });
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
