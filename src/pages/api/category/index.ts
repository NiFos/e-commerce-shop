import { NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { productModel } from '../../../models/product';

/**
 * Subcategory products
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { subcategoryid, tags, prices, pagesize, after } = req.body;
    const products = await productModel.getAllProductsInSubcategory(
      +subcategoryid,
      JSON.parse(tags),
      JSON.parse(prices),
      +pagesize,
      +after
    );
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
