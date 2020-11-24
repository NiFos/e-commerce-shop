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
  ): Promise<stripe.Response<stripe.Checkout.Session>> {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
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
   * Get line items from checkout
   * @param checkoutId - Checkout id
   */
  async getLineItems(
    checkoutId: string
  ): Promise<stripe.Response<stripe.ApiList<stripe.LineItem>>> {
    const lineItems = await stripeInstance.checkout.sessions.listLineItems(
      checkoutId
    );
    return lineItems;
  },
};
