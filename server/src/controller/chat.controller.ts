import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;

    // Find all distinct users the current user has sent or received messages with
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, name: true, email: true, schoolCategory: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, schoolCategory: true },
        },
      },
    });

    const conversationMap = new Map<number, {
      id: number; // chat identifier (partner user ID)
      participant: {
        id: number;
        name: string;
        email: string;
        schoolCategory: string | null;
      };
      lastMessage: {
        id: number;
        senderId: number;
        receiverId: number;
        content: string;
        isRead: boolean;
        isEdited: boolean;
        createdAt: string;
      };
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const isSender = msg.senderId === currentUserId;
      const partner = isSender ? msg.receiver : msg.sender;

      if (!conversationMap.has(partner.id)) {
        conversationMap.set(partner.id, {
          id: partner.id,
          participant: partner,
          lastMessage: {
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            isRead: msg.isRead,
            isEdited: msg.isEdited,
            createdAt: msg.createdAt.toISOString(),
          },
          unreadCount: 0,
        });
      }

      // Increment unread count if message was received by current user and is not read
      if (!isSender && !msg.isRead) {
        const existing = conversationMap.get(partner.id)!;
        existing.unreadCount += 1;
      }
    }

    res.status(200).json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessagesWithUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const partnerId = parseInt(req.params.partnerId as string, 10);
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;

    if (isNaN(partnerId)) {
      res.status(400).json({ message: 'Invalid partner user ID' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
      orderBy: { id: 'desc' }, // Order by newest first
      take: limit + 1, // Take one extra to check if there are more
      ...(cursor && !isNaN(cursor) ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    let nextCursor: number | null = null;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem!.id;
    }

    // Mark unread messages from partner as read (only those fetched in this batch)
    const unreadMessageIds = messages
      .filter(msg => msg.senderId === partnerId && !msg.isRead)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadMessageIds } },
        data: { isRead: true },
      });
    }

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      isRead: msg.isRead,
      isEdited: msg.isEdited,
      createdAt: msg.createdAt.toISOString(),
      sender: msg.sender,
      receiver: msg.receiver,
    }));

    res.status(200).json({ messages: formattedMessages, nextCursor });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const partnerId = parseInt(req.params.partnerId as string, 10);

    if (isNaN(partnerId)) {
      res.status(400).json({ message: 'Invalid partner user ID' });
      return;
    }

    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessageHttp = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      res.status(400).json({ message: 'Receiver ID and content are required' });
      return;
    }

    const receiverExists = await prisma.user.findUnique({
      where: { id: Number(receiverId) },
    });

    if (!receiverExists) {
      res.status(404).json({ message: 'Recipient user not found' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId: Number(receiverId),
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    const formattedMessage = {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      isRead: message.isRead,
      isEdited: message.isEdited,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
      receiver: message.receiver,
    };

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${receiverId}`).emit('receive_message', formattedMessage);
      io.to(`user:${currentUserId}`).emit('receive_message', formattedMessage);
    }

    res.status(201).json({
      message: formattedMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editMessageHttp = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const messageId = parseInt(req.params.messageId as string, 10);
    const { content } = req.body;

    if (isNaN(messageId) || !content?.trim()) {
      res.status(400).json({ message: 'Message ID and content are required' });
      return;
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.senderId !== currentUserId) {
      res.status(403).json({ message: 'You can only edit your own messages' });
      return;
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content: content.trim(), isEdited: true },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    const formattedMessage = {
      id: updatedMessage.id,
      senderId: updatedMessage.senderId,
      receiverId: updatedMessage.receiverId,
      content: updatedMessage.content,
      isRead: updatedMessage.isRead,
      isEdited: updatedMessage.isEdited,
      createdAt: updatedMessage.createdAt.toISOString(),
      sender: updatedMessage.sender,
      receiver: updatedMessage.receiver,
    };

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${updatedMessage.receiverId}`).emit('message_edited', formattedMessage);
      io.to(`user:${currentUserId}`).emit('message_edited', formattedMessage);
    }

    res.status(200).json({ message: formattedMessage });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMessageHttp = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const messageId = parseInt(req.params.messageId as string, 10);

    if (isNaN(messageId)) {
      res.status(400).json({ message: 'Invalid message ID' });
      return;
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.senderId !== currentUserId) {
      res.status(403).json({ message: 'You can only delete your own messages' });
      return;
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${message.receiverId}`).emit('message_deleted', { messageId, receiverId: message.receiverId, senderId: currentUserId });
      io.to(`user:${currentUserId}`).emit('message_deleted', { messageId, receiverId: message.receiverId, senderId: currentUserId });
    }

    res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
