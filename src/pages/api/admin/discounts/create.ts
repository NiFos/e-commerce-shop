import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
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

    const { title, description, to, percentage, promocode } = req.body;
    const discount = await discountModel.createDiscount({
      created_by: user.id,
      date_to: new Date(to).toISOString(),
      description,
      title,
      percent_discount: +percentage,
      promocode,
    });
    if (!discount[0]?.discount_id) throw 'Not create!';

    return res.json({ discount: discount[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(handler), 'POST');
