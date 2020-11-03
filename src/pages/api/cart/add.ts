import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Add product to cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { productid, quantity } = req.body;
    const product = await cartModel.addToCart(user.id, +productid, +quantity);
    return res.json({
      product: {
        productId: product[0]?.product_id,
        quantity: product[0]?.quantity,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
