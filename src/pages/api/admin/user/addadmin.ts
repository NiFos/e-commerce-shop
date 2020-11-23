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
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const { userId, fullaccess } = req.body;

    const adminExist = await adminModel.checkIfAdminExist(+userId);
    if (adminExist) throw 'Admin exist';

    const userInfo = await userModel.findUserById(+userId);
    if (!userInfo[0]?.user_id) throw 'Cannot find user';

    const response = await adminModel.addUserToAdmins(+userId, fullaccess);
    if (!response[0]?.user_id) throw 'Something went wrong!';

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
      message: error.toString(),
    });
  }
}
export default withUser(addAdminHandler);
