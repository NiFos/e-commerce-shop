import { NextApiResponse } from 'next';
import { orderStatus } from '../../../libs/statuses';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';
import { orderModel } from '../../../models/order';
import { stripeModel } from '../../../models/stripe';
import { userModel } from '../../../models/user';

/**
 * Confirm payment session and create order
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const session = req.body;

    const userInfo = await userModel.findUserById(
      +session.data.object.metadata.userId
    );
    if (userInfo.length <= 0) throw 'User not found!';

    const lineItems = await stripeModel.getLineItems(session.data.object.id);

    const order = await orderModel.createOrder(
      userInfo[0].user_id,
      userInfo[0].delivery_address,
      orderStatus.paymentConfirmed.id,
      session?.metadata?.promocode || '',
      lineItems.data
    );
    if (order.length <= 0) throw 'Something went wrong!';

    await cartModel.cleanUserCart(userInfo[0].user_id);
    return res.json({ order });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
