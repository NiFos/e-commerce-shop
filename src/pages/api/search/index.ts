import { NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { productModel } from '../../../models/product';

/**
 * Search products by name
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { name } = req.query;
    const products = await productModel.searchProducts(name.toString());
    return res.json({
      products,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default handler;