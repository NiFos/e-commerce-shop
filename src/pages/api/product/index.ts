import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { productModel } from '../../../models/product';
import { reviewModel } from '../../../models/review';

/**
 * Product
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { productid } = req.query;
    const product = await productModel.getProduct(+productid);
    if (product.length <= 0) return res.json({});
    const reviews = await reviewModel.getProductReviews(+productid);
    return res.json({
      ...product[0],
      reviews,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default handler;
