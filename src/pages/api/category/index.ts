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
    const { subcategoryId, tags, prices, pageSize, page } = req.body;

    const products = await productModel.getAllProductsInSubcategory(
      +subcategoryId,
      tags,
      prices,
      +pageSize,
      +page
    );
    const hasMore = products.length > pageSize;
    if (hasMore) {
      products.splice(products.length - 1, 1);
    }

    return res.json({
      products: products.map((item) => ({
        ...item,
        photo: getPhotoUrl('products', '' + item.product_id),
      })),
      hasMore,
      page: page || 1,
      pageSize,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(handler, 'POST');
