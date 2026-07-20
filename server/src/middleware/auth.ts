import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';
import { getSession } from '../config/cache.js';
import type { User } from '../../generated/prisma/browser.js';
import {
  UserRole,
  type UserRole as UserRoleEnum,
} from '../../generated/prisma/enums.js';

type AuthenticatedUser = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'schoolCategory'
>;

const roleRank: Record<UserRoleEnum, number> = {
  [UserRole.USER]: 0,
  [UserRole.ALUMNI]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPER_ADMIN]: 3,
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware =
  (requiredRole?: UserRoleEnum) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.cookies);
      const cookieSessionId = req.cookies?.sessionId;
      const authHeader = req.headers.authorization;
      const bearerSessionId = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;
      const sessionId = cookieSessionId ?? bearerSessionId;

      if (!sessionId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const session = await getSession(sessionId);
      console.log(session);

      if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          schoolCategory: true,
        },
      });

      console.log(user);

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (
        requiredRole &&
        roleRank[user.role as UserRoleEnum] < roleRank[requiredRole]
      ) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
