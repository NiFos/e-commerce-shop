import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { userModel } from '../../../../models/user';

/**
 * Handler for adding user to admin list
 */
async function searchUserHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin) throw new Error('Unauthorized');

    const { username } = req.query;

    const users = await userModel.findUsers(+username);
    return res.json({ users });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}
export default withUser(searchUserHandler);
