import { NextApiRequest, NextApiResponse } from 'next';

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: {
    id?: number;
    username?: string;
    admin?: {
      isAdmin?: boolean;
      fullAccess?: boolean;
    };
  };
}
/**
 * @param handler Pass handler from /api
 */
export const withUser = (handler: any) => (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  req.user = {
    id: 0,
    username: 'username',
    admin: { isAdmin: true, fullAccess: true },
  };
  return handler(req, res);
};
