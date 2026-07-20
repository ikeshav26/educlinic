import type { CookieOptions } from 'express';

export const config = {
  cookieOptions: {
    httpOnly: true,
    sameSite: 'none' as const,
    secure: true,
    domain: process.env.COOKIE_DOMAIN || undefined,
  } as CookieOptions,
};
