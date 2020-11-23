import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { orderModel } from '../../../../models/order';

/**
 * Delete order handler
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

    const { orderId } = req.query;

    const order = await orderModel.deleteOrder(+orderId);

    if (order !== 1) throw 'Not found!';

    return res.json({ deletedId: orderId });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
