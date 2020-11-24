import { NextApiResponse } from 'next';
import { authUtil } from '../../../libs/auth';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { authModel } from '../../../models/auth';
import { userModel } from '../../../models/user';

/**
 * Login handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { email, password } = req.body;
    if (typeof email === 'undefined' || typeof password === 'undefined')
      throw 'Email or password not passed!';
    const authResponse = await authModel.login(email.toLowerCase(), password);
    if (!authResponse[0]?.user_id) throw 'Not found!';

    const user = await userModel.findUserById(authResponse[0].user_id);
    if (!user[0]?.user_id) throw 'User not exist!';

    const payload = {
      user: {
        id: user[0].user_id,
        username: user[0].username,
        admin: {
          isAdmin: user[0].admin.isAdmin,
          fullAccess: user[0].admin.fullAccess,
        },
      },
    };
    const cookie = authUtil.genCookie(payload);
    const tokenInDb = await authModel.setCookieInDb(
      authResponse[0].user_id,
      false,
      cookie
    );
    if (tokenInDb) {
      authUtil.setAuthCookie(res, cookie);
    }
    return res.json(payload);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(handler, 'POST');
