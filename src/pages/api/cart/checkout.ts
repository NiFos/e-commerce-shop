import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { orderModel } from '../../../models/order';
import { userModel } from '../../../models/user';

/**
 * Add product to cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const userInfo = await userModel.findUserById(user.id);
    if (userInfo.length <= 0) throw 'User not found!';
    const order = await orderModel.createOrder(
      userInfo[0].user_id,
      userInfo[0].delivery_address
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
