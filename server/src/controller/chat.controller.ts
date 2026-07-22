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
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    // Mark unread messages from partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt.toISOString(),
      sender: msg.sender,
      receiver: msg.receiver,
    }));

    res.status(200).json({ messages: formattedMessages });
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

    res.status(201).json({
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        isRead: message.isRead,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
        receiver: message.receiver,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
