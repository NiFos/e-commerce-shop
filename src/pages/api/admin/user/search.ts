import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
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
    if (typeof user?.id === 'undefined' || !user.admin?.isAdmin)
      throw 'Unauthorized';

    const { username } = req.query;

    const users = await userModel.findUsers(username.toString());
    return res.json({ users });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}
export default withMethod(withUser(searchUserHandler), 'GET');
