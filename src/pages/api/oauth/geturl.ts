import { NextApiResponse } from 'next';
import { authUtil } from '../../../libs/auth';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';

/**
 * Get google oauth url handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const url = await authUtil.getOauthUrl();
  return res.json({
    url,
  });
}

export default withMethod(handler, 'GET');
