import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { reviewModel } from '../../../models/review';

/**
 * Send product review
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';
    const { productId, rating, text } = req.body;

    const response = await reviewModel.addReview(
      +productId,
      user.id,
      +rating,
      text
    );
    if (response.length <= 0) throw 'Not created!';
    return res.json({
      reviewId: response[0].review_id,
      user: {
        userId: user.id,
        username: user.username,
      },
      rating: response[0].rating,
      text: response[0].text,
      date: response[0].created_on,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
