import { NextApiResponse } from 'next';
import { authUtil } from '../../../libs/auth';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { authModel } from '../../../models/auth';
import { userModel } from '../../../models/user';

/**
 * Validating oauth code from query param
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const code = req.query;
    const codePayload = await authUtil.getUserInfo(code.code.toString());

    if (!codePayload?.data?.id) throw 'Not auth';

    const userExist = await authModel.isUserExist(codePayload.data.email || '');
    let userId = userExist;
    if (typeof userExist === 'undefined') {
      const password = authUtil.genPassword();
      const register = await authModel.register(
        codePayload.data.email || '',
        codePayload.data.name || '',
        password
      );
      if (register[0]?.user_id) throw 'Not registered';
      userId = register[0]?.user_id;
    }
    const user = await userModel.findUserById(+userId);
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
    const tokenInDb = await authModel.setCookieInDb(+userId, false, cookie);
    if (tokenInDb) {
      authUtil.setAuthCookie(res, cookie);
    }
    return res.redirect('/');
  } catch (error) {
    console.log(error.toString());

    return res.redirect('/');
  }
}

export default withMethod(handler, 'GET');
