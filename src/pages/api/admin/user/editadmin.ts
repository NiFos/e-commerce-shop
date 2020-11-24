import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
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
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const { userId, fullAccess } = req.body;

    const adminExist = await adminModel.checkIfAdminExist(+userId);
    if (!adminExist) throw 'Admin not exist';

    const editedAdmin = await adminModel.editAdminAccessLevel(
      +userId,
      fullAccess
    );
    if (editedAdmin <= 0) throw 'Something went wrong!';

    const userInfo = await userModel.findUserById(+userId);
    if (!userInfo[0]?.user_id) throw 'Cannot find user!';

    return res.json({
      user: {
        userId: userInfo[0].user_id,
        username: userInfo[0].username,
      },
      fullAccess: fullAccess,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}
export default withMethod(withUser(editAdminHandler), 'POST');
