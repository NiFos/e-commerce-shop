import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Remove product from cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { productId } = req.body;
    const product = await cartModel.removeFromCart(user.id, +productId);
    if (product === 0) throw 'Not found!';
    return res.json({
      deletedId: +productId,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
