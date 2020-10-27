import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { adminModel } from '../../../../models/admin';

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

    const admins = await adminModel.getAllAdmins();
    if (admins.length <= 0) throw new Error('Not found');

    return res.json({
      admins,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}
export default withUser(addAdminHandler);
