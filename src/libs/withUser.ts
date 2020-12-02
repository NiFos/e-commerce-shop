/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

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
): NextApiRequestWithUser => {
  try {
    const cookie = req.cookies.authorization;
    if (typeof cookie === 'undefined') return handler(req, res);

    const cookiePayload = jwt.verify(cookie, jwtSecret) as IUser;
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
export const checkUser = (req: IncomingMessage): IUser => {
  const cookie = parseAuthCookie(req.headers.cookie || '');
  if (!cookie) return {};

  const cookiePayload = jwt.verify(cookie, jwtSecret) as IUser;
  return cookiePayload;
};

/**
 * Parse auth cookie
 * @param cookie - Cookie string
 */
const parseAuthCookie = (cookie: string): string => {
  const splitCookie = cookie.split(';');
  const cookies: { authorization?: string } = {};

  splitCookie.forEach((item) => {
    const str = item.trim();
    const [key, value] = str.split('=');
    Object.assign(cookies, { [key]: value });
  });

  return cookies.authorization || '';
};
