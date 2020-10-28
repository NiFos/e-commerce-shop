import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel } from '../../../../models/discount';

/**
 * Get discount handler
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

    const discount = await discountModel.getDiscountById(+discountid);

    if (!discount[0]?.product_id) throw 'Not found!';

    return res.json({ discount: discount[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
