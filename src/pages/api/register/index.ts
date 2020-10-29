import { NextApiResponse } from 'next';
import { authUtil } from '../../../libs/auth';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { authModel } from '../../../models/auth';

/**
 * Register handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { email, username, password } = req.body;
    if (
      typeof email === 'undefined' ||
      typeof password === 'undefined' ||
      typeof username === 'undefined'
    )
      throw 'Email or password not passed!';
    const authResponse = await authModel.register(
      email.toLowerCase(),
      username,
      password
    );
    if (!authResponse[0]?.user_id) throw 'Exist!';

    const payload = {
      user: {
        id: authResponse[0].user_id,
        username: authResponse[0].username,
        admin: {
          isAdmin: false,
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

export default handler;
