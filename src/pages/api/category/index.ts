import { NextApiResponse } from 'next';
import { getPhotoUrl } from '../../../libs/storage';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { productModel } from '../../../models/product';

/**
 * Subcategory products
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { subcategoryId, tags, prices, pageSize, after } = req.body;

    const products = await productModel.getAllProductsInSubcategory(
      +subcategoryId,
      tags,
      prices,
      +pageSize,
      +after
    );

    return res.json({
      products: products.map((item: any) => ({
        ...item,
        photo: getPhotoUrl('products', item.product_id),
      })),
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(handler, 'POST');
