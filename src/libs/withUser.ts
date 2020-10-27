import { NextApiRequest, NextApiResponse } from 'next';

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: {
    id?: number;
    username?: string;
    isAdmin?: boolean;
  };
}
/**
 * @param handler Pass handler from /api
 */
export const withUser = (handler: any) => (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  const user = { id: 0, username: 'username', isAdmin: true };
  req.user = user;
  return handler(req, res);
};
