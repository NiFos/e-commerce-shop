import { NextApiResponse } from 'next';
import { orderStatus } from '../../../libs/statuses';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { orderModel } from '../../../models/order';
import { userModel } from '../../../models/user';

/**
 * Confirm payment session and create order
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const session = req.body;

    const userInfo = await userModel.findUserById(+session.metadata.userId);
    if (userInfo.length <= 0) throw 'User not found!';

    const order = await orderModel.createOrder(
      userInfo[0].user_id,
      userInfo[0].delivery_address,
      orderStatus.paymentConfirmed.id,
      session.metadata.promocode
    );
    if (order.length <= 0) throw 'Something went wrong!';

    return res.json({ order });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
