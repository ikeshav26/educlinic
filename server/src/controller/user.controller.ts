import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const search = req.query.search as string || '';
        const limit = parseInt(req.query.limit as string) || 16;
        const skip = parseInt(req.query.skip as string) || 0;

        const whereClause: any = {};
        
        if (userId) {
            // Get all user IDs the current user is already following
            const following = await prisma.follow.findMany({
                where: { followerId: userId },
                select: { followingId: true }
            });
            const followingIds = following.map(f => f.followingId);

            whereClause.id = { notIn: [userId, ...followingIds] };
        }
        
        if (search) {
            whereClause.name = { contains: search, mode: 'insensitive' };
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    schoolCategory: true,
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where: whereClause })
        ]);

        let followingIds = new Set<number>();
        if (userId) {
            const following = await prisma.follow.findMany({
                where: {
                    followerId: userId,
                    followingId: { in: users.map(u => u.id) }
                }
            });
            followingIds = new Set(following.map(f => f.followingId));
        }

        const formattedUsers = users.map(u => ({
            ...u,
            isFollowed: followingIds.has(u.id)
        }));

        res.json({ users: formattedUsers, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id as string);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                schoolCategory: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
