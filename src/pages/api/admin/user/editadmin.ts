import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { adminModel } from '../../../../models/admin';
import { userModel } from '../../../../models/user';

/**
 * Handler for editing user in admin list
 */
async function editAdminHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { userid, fullaccess } = req.body;

    const adminExist = await adminModel.checkIfAdminExist(userid);
    if (!adminExist) throw new Error('Admin not exist');

    const editedAdmin = await adminModel.editAdminAccessLevel(
      userid,
      fullaccess
    );
    if (editedAdmin <= 0) throw new Error('Something went wrong!');

    const userInfo = await userModel.findUserById(userid);
    if (!userInfo[0].user_id) throw new Error('Cannot find user!');

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
export default withUser(editAdminHandler);
