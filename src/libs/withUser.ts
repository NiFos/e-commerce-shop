import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export interface IUser {
  user?: {
    id?: number;
    username?: string;
    phone?: string;
    deliveryaddress?: string;
    admin?: {
      isAdmin?: boolean;
      fullAccess?: boolean;
    };
  };
}

export interface NextApiRequestWithUser extends NextApiRequest, IUser {}

/**
 * @param handler Pass handler from /api
 */
export const withUser = (handler: any) => (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  try {
    const cookie = req.cookies.authorization;
    if (typeof cookie === 'undefined') return handler(req, res);

    const cookiePayload = jwt.verify(cookie, jwtSecret) as any;
    req.user = cookiePayload?.user;

    return handler(req, res);
  } catch (error) {
    return handler(req, res);
  }
};

/**
 * Check user
 * @param req - Context req
 */
export const checkUser = (req: any): IUser => {
  const cookie = parseAuthCookie(req.headers.cookie);
  if (!cookie) return {};

  const cookiePayload = jwt.verify(cookie, jwtSecret) as any;
  return cookiePayload;
};

/**
 * Parse auth cookie
 * @param cookie - Cookie string
 */
const parseAuthCookie = (cookie: string): string => {
  const splitCookie = cookie.split(';');
  const cookies: any = {};
  splitCookie.forEach((item) => {
    const [key, value] = item.split('=');
    Object.assign(cookies, { [key]: value });
  });

  return cookies.authorization;
};
