import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel } from '../../../../models/discount';

/**
 * Create discount handler
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

    const { title, description, to, percentage, products } = req.body;
    const discount = await discountModel.createDiscount({
      created_by: user.id,
      date_to: to,
      description,
      title,
      percent_discount: percentage,
      products,
    });
    if (!discount[0]?.discount_id) throw 'Not create!';

    return res.json({ categories: discount[0] });
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
