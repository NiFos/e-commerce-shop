import { database } from '../libs/db';

export const cartTable = 'users_cart';
export const cartModel = {
  /**
   * Add product to cart
   * @param userId - User id
   * @param productId - Product id
   */
  async addToCart(userId: number, productId: number, quantity: number) {
    if (
      typeof productId === 'undefined' ||
      typeof userId === 'undefined' ||
      typeof quantity === 'undefined'
    )
      return [];
    return await database()
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .into(cartTable)
      .returning('*');
  },

  /**
   * Get user products in cart
   * @param userId - User id
   */
  async getUserCart(userId: number) {
    if (typeof userId === 'undefined') return [];
    return await database()
      .select('*')
      .from(cartTable)
      .where('user_id', '=', userId);
  },

  /**
   * Remove product from cart
   * @param userId - User id
   * @param productId - Product id
   */
  async removeFromCart(userId: number, productId: number) {
    if (typeof userId === 'undefined' || typeof productId === 'undefined')
      return 0;
    return await database().delete().from(cartTable).where({
      user_id: userId,
      product_id: productId,
    });
  },
  /**
   * Clean cart
   * @param userId - User id
   */
  async cleanUserCart(userId: number) {
    if (typeof userId === 'undefined') return 0;
    return await database()
      .delete()
      .from(cartTable)
      .where('user_id', '=', userId);
  },

  /**
   * Edit quantity product
   * @param userId - User id
   * @param productId - Product id
   * @param quantity - Quantity
   */
  async editCartProduct(userId: number, productId: number, quantity: number) {
    if (
      typeof userId === 'undefined' ||
      typeof productId === 'undefined' ||
      typeof quantity === 'undefined'
    )
      return 0;
    return await database()
      .update({
        quantity,
      })
      .from(cartTable)
      .where({
        user_id: userId,
        product_id: productId,
      });
  },
};