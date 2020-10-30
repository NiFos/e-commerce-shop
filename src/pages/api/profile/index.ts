import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { orderModel } from '../../../models/order';
import { userModel } from '../../../models/user';

/**
 * Profile handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';
    const orders = await orderModel.getUserOrders(user.id);
    const userInformation = await userModel.findUserById(user.id);
    return res.json({
      username: user.username,
      phone: userInformation[0].phone,
      deliveryAddress: userInformation[0].delivery_address,
      orders,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
