import { NextApiResponse } from 'next';
import { getPhotoUrl } from '../../../../libs/storage';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Get product
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined' || !user.admin?.isAdmin)
      throw 'Unauthorized';

    const { productId } = req.query;

    const product = await productModel.getProduct(+productId);

    if (!product[0]?.product_id) throw 'Not found!';

    return res.json({
      product: {
        ...product[0],
        photo: getPhotoUrl('products', productId.toString()),
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(handler);
