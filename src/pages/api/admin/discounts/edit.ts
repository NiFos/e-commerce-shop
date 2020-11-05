import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel, IDiscountUpdate } from '../../../../models/discount';

/**
 * Edit discount handler
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

    const { discountid, title, description } = req.body;

    const data: IDiscountUpdate = {};
    if (title) data.title = title;
    if (description) data.description = description;

    const categories = await discountModel.editDiscount(+discountid, data);
    if (categories <= 0) throw 'Not found!';

    return res.json({ category: { discountid, title } });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
