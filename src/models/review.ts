import { database } from '../libs/db';

const reviewsTable = 'reviews';
const usersTable = 'users';

export const reviewModel = {
  /**
   *
   * @param productId - Product id
   * @param rating - Rating (1-5)
   * @param text - Review message
   */
  async addReview(
    productId: number,
    senderId: number,
    rating: number,
    text: string
  ): Promise<any> {
    if (
      typeof productId === 'undefined' ||
      typeof senderId === 'undefined' ||
      typeof rating === 'undefined' ||
      typeof text === 'undefined'
    )
      return [];
    return await database()
      .insert({
        product_id: productId,
        sender_id: senderId,
        rating,
        text,
      })
      .into(reviewsTable)
      .returning('*');
  },

  /**
   * Get all products reviews
   * @param productId - Product id
   */
  async getProductReviews(productId: number): Promise<any> {
    if (typeof productId === 'undefined') return [];

    const reviews = await database()
      .select('*')
      .from(reviewsTable)
      .where('product_id', '=', productId);
    if (reviews.length <= 0) return [];

    const sendersIds = reviews.map((item) => item.sender_id);
    const users = await database()
      .select('username', 'user_id')
      .from(usersTable)
      .whereIn('user_id', sendersIds);

    const response = reviews.map((review) => {
      const userId = users.findIndex(
        (user) => review.sender_id === user.user_id
      );
      return {
        ...review,
        user: {
          username: users[userId].username,
          userId: users[userId].user_id,
        },
      };
    });
    return response;
  },
};
