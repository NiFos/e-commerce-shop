import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @param handler Pass handler from /api
 */
export const withMethod = (
  handler: any,
  allowedMethod: 'GET' | 'POST' | 'DELETE'
) => (req: NextApiRequest, res: NextApiResponse): NextApiRequest | void => {
  if (allowedMethod === (req.method || '')) {
    return handler(req, res);
  } else {
    return res.status(400).json({
      error: true,
      message: 'Not allowed method!',
    });
  }
};
