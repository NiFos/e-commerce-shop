import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel } from '../../../../models/discount';
import { productModel } from '../../../../models/product';

/**
 * Get discount handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { discountid } = req.query;

    const discount = await discountModel.getDiscountById(+discountid);

    if (!discount[0].product_id) throw new Error('Not found!');

    return res.json({ error: false, discount: discount[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(handler);
