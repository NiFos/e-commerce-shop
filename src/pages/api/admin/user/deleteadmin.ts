import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { adminModel } from '../../../../models/admin';
import { userModel } from '../../../../models/user';

/**
 * Handler for deleting user from admin list
 */
async function deleteAdminHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const { userid } = req.query;

    const adminExist = await adminModel.checkIfAdminExist(+userid);
    if (!adminExist) throw 'Admin not found';

    const deletedAdmin = await adminModel.deleteAdmin(+userid);
    if (deletedAdmin !== 1) throw 'Something went wrong!';

    const userInfo = await userModel.findUserById(+userid);
    if (!userInfo[0]?.user_id) throw 'Cannot find user!';

    return res.json({
      user: {
        userId: userInfo[0].user_id,
        username: userInfo[0].username,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}
export default withUser(deleteAdminHandler);
