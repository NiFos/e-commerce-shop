import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { adminModel } from '../../../../models/admin';
import { userModel } from '../../../../models/user';

/**
 * Handler for adding user to admin list
 */
async function addAdminHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { userid, fullaccess } = req.body;

    const adminExist = await adminModel.checkIfAdminExist(+userid);
    if (adminExist) throw new Error('Admin exist');

    const userInfo = await userModel.findUserById(+userid);
    if (!userInfo[0].user_id) throw new Error('Cannot find user');

    const response = await adminModel.addUserToAdmins(+userid, fullaccess);
    if (!response[0].user_id) throw new Error('Something went wrong!');

    return res.json({
      user: {
        userId: userInfo[0].user_id,
        username: userInfo[0].username,
      },
      fullAccess: fullaccess,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}
export default withUser(addAdminHandler);
