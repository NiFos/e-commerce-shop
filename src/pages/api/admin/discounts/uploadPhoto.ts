import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { uploadFile } from '../../../../libs/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Upload photo to discount
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';
    const { discountid, mod } = req.query;
    if (typeof +discountid === 'undefined') throw 'Not enough params';
    const response = await uploadFile(req, 'discounts', discountid.toString());
    if (!response.success) throw response.message;
    return res.json({
      photo: `${response.message}${mod ? `?mod=${Date.now()}` : ''}`,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);