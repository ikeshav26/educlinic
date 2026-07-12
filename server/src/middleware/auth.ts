import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';
import type { User } from '../../generated/prisma/browser.js';
import {
  UserRole,
  type UserRole as UserRoleEnum,
} from '../../generated/prisma/enums.js';

type AuthenticatedUser = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'schoolCategory'
>;

type AuthTokenPayload = JwtPayload & {
  id: number;
  role: string;
};

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
      const cookieToken = req.cookies?.token;
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;
      const token = cookieToken ?? bearerToken;

      if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      console.log(decoded);

      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        !('id' in decoded) ||
        !('role' in decoded)
      ) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const payload = decoded as AuthTokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
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
