import { NextApiResponse } from 'next';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Add product to cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { productId, quantity } = req.body;
    const product = await cartModel.addToCart(user.id, +productId, +quantity);
    if (product.length <= 0) throw 'Not added!';
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

export default withMethod(withUser(handler), 'POST');
