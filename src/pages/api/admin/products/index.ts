import { NextApiResponse } from 'next';
import { getPhotoUrl } from '../../../../libs/storage';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Get all products
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined' || !user.admin?.isAdmin)
      throw 'Unauthorized';

    const { pagesize, page } = req.query;
    const products = await productModel.getAllProducts(+pagesize, +page);
    const hasMore = products.length > +pagesize;
    products.splice(products.length - 1, 1);
    return res.json({
      products: products.map((item: any) => ({
        ...item,
        photo: getPhotoUrl('products', item.product_id),
      })),
      hasMore,
      page,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
