import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { orderModel } from '../../../../models/order';

/**
 * Edit order handler
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

    const { orderId, status } = req.body;

    const order = await orderModel.editOrderStatus(+orderId, +status);
    if (order <= 0) throw 'Not found!';

    return res.json({ order: { orderId, status } });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
