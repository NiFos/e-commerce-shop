import { database } from '../libs/db';
import { usersTable } from './user';

export interface IReviewModel {
  review_id: number;
  sender_id: number;
  username?: string;
  product_id: number;
  rating: number;
  text: string;
  created_on: Date;
}

export const reviewsTable = 'reviews';

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
  ): Promise<IReviewModel[]> {
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
  async getProductReviews(productId: number): Promise<IReviewModel[]> {
    if (typeof productId === 'undefined') return [];

    const reviews = await database()
      .select(`${reviewsTable}.*`, `${usersTable}.username`)
      .from(reviewsTable)
      .innerJoin(
        usersTable,
        `${reviewsTable}.sender_id`,
        `${usersTable}.user_id`
      )
      .where('product_id', '=', productId);
    if (reviews.length <= 0) return [];

    return reviews;
  },
};
