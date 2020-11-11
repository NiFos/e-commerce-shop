import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';

/**
 * Me handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const user = req.user;
  return res.json({
    user: {
      userid: user?.id,
      username: user?.username,
      admin: {
        isAdmin: user?.admin?.isAdmin,
        fullAccess: user?.admin?.fullAccess,
      },
    },
    cart: [],
  });
}

export default withUser(handler);
