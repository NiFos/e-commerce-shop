import { NextApiResponse } from 'next';
import { authUtil } from '../../../libs/auth';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';

/**
 * Login handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';
    authUtil.clearCookie(res);
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
