import { NextApiResponse } from 'next';
import { getPhotoUrl } from '../../../../libs/storage';
import { withMethod } from '../../../../libs/withMethod';
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

    const { discountId } = req.query;

    const discount = await discountModel.getDiscountById(+discountId);

    if (!discount[0]?.discount_id) throw 'Not found!';

    return res.json({
      discount: {
        ...discount[0],
        photo: getPhotoUrl('discounts', discountId.toString()),
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(handler), 'GET');
