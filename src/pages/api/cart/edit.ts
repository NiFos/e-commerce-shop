import { NextApiResponse } from 'next';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Edit product quantity in cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { productId, quantity } = req.body;
    const product = await cartModel.editCartProduct(
      user.id,
      +productId,
      +quantity
    );
    if (product !== 1) throw 'Not found!';
    return res.json({
      product: {
        productId: +productId,
        quantity,
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
