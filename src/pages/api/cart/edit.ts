import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { cartModel } from '../../../models/cart';

/**
 * Edit product quantity in cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { productid, quantity } = req.body;
    const product = await cartModel.editCartProduct(
      user.id,
      +productid,
      +quantity
    );
    if (product !== 1) throw 'Not found!';
    return res.json({
      product: {
        productId: +productid,
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

export default withUser(handler);
