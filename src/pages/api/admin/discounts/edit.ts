import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel, IDiscountUpdate } from '../../../../models/discount';

/**
 * Edit discount handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { discountid, title, description, percentage, to } = req.body;

    const data: IDiscountUpdate = {};
    if (title) data.title = title;
    if (to) data.date_to = to;
    if (description) data.description = description;
    if (percentage) data.percent_discount = percentage;

    const categories = await discountModel.editDiscount(+discountid, data);
    if (categories <= 0) throw new Error('not found!');

    return res.json({ error: false, category: { discountid, title } });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(handler);
