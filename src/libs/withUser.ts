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
  const cookie = req.cookies.authorization;
  const cookiePayload = jwt.verify(cookie, jwtSecret) as any;

  req.user = cookiePayload?.user;
  return handler(req, res);
};
