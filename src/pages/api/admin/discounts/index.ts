import { NextApiResponse } from 'next';
import { getPhotoUrl } from '../../../../libs/storage';
import { withMethod } from '../../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { discountModel } from '../../../../models/discount';

/**
 * Get all discounts handler
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

    const discounts = await discountModel.getAllDiscounts();
    return res.json(
      discounts.map((item: any) => ({
        ...item,
        photo: getPhotoUrl('discounts', item.discount_id),
      }))
    );
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(handler), 'GET');
