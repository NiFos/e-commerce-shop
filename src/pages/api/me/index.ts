import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { withMethod } from '../../../libs/withMethod';
import { cartModel } from '../../../models/cart';

/**
 * Me handler
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const user = req.user;
  const cart = await cartModel.getUserCart(user?.id);
  return res.json({
    user: {
      id: user?.id,
      username: user?.username,
      admin: {
        isAdmin: user?.admin?.isAdmin,
        fullAccess: user?.admin?.fullAccess,
      },
    },
    cart: cart.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    })),
  });
}

export default withMethod(withUser(handler), 'GET');
