import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel } from '../../../../models/discount';

/**
 * Delete discount handler
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

    const { discountid } = req.query;

    const deletedDiscount = await discountModel.deleteDiscount(+discountid);
    if (deletedDiscount !== 1) throw 'Not found!';

    return res.json({ deletedId: discountid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
