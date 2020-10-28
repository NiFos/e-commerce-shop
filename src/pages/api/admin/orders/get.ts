import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { orderModel } from '../../../../models/order';

/**
 * Get discount handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined' || !user.admin?.isAdmin)
      throw 'Unauthorized';

    const { orderid } = req.query;

    const order = await orderModel.getOrderById(+orderid);

    if (!order[0]?.order_id) throw 'Not found!';

    return res.json({ discount: order[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
