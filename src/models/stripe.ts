import stripe from 'stripe';

const apiKey = process.env.STRIPE_API_KEY || '';
const successUrl = process.env.STRIPE_SUCCESS_URL || '';
const cancelUrl = process.env.STRIPE_CANCEL_URL || '';

const stripeInstance = new stripe(apiKey, {
  apiVersion: '2020-08-27',
  typescript: true,
});

export const stripeModel = {
  /**
   * Create stripe payment session
   * @param userId - User id
   * @param orderId - Order id
   */
  async createSession(
    userId: number,
    products: stripe.Checkout.SessionCreateParams.LineItem[],
    promocode: string
  ) {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: '' + userId,
      mode: 'payment',
      metadata: {
        userId,
        promocode,
      },
      line_items: products,
    });
    return session;
  },

  /**
   * Create stripe discount promocode
   * @param promocode - Promocode (FALL20)
   * @param to - Expires date (timestamp)
   */
  async createDiscount(promocode: string, to: number) {
    const discount = await stripeInstance.promotionCodes.create({
      coupon: promocode.toUpperCase(),
      expires_at: to,
    });
    return discount;
  },
};
