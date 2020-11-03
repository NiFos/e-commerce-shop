import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Get user products in cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const cart = await cartModel.getUserCart(user.id);
    return res.json({
      products: cart.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
