import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
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
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const { userId, fullAccess } = req.body;

    const adminExist = await adminModel.checkIfAdminExist(+userId);
    if (adminExist) throw 'Admin exist';

    const userInfo = await userModel.findUserById(+userId);
    if (userInfo.length <= 0) throw 'Cannot find user';

    const response = await adminModel.addUserToAdmins(+userId, fullAccess);
    if (response.length <= 0) throw 'Something went wrong!';
    return res.json({
      user: {
        userId: userInfo[0].user_id,
        username: userInfo[0].username,
      },
      fullAccess,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}
export default withMethod(withUser(addAdminHandler), 'POST');
