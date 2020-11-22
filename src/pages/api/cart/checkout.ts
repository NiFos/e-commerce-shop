import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { userModel } from '../../../models/user';
import { cartModel } from '../../../models/cart';
import { stripeModel } from '../../../models/stripe';
import { discountModel } from '../../../models/discount';
import stripe from 'stripe';

/**
 * Checkout
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const userInfo = await userModel.findUserById(user.id);
    if (userInfo.length <= 0) throw 'User not found!';

    const products = await cartModel.getUserCart(user.id);
    if (products.length <= 0) throw 'Cart not found!';

    const { promocode } = req.body;
    const discount = await discountModel.getDiscountByPromocode(promocode);
    const stripeProducts = products.map(
      (item): stripe.Checkout.SessionCreateParams.LineItem => ({
        quantity: item.quantity,
        description: item.product_id,
        price_data: {
          product_data: {
            name: item.title,
          },
          currency: 'USD',
          unit_amount:
            item.price *
            100 *
            ((100 - (discount[0]?.percent_discount || 0)) / 100),
        },
      })
    );
    const session = await stripeModel.createSession(
      user.id,
      stripeProducts,
      promocode
    );

    return res.json({ stripeId: session.id });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
