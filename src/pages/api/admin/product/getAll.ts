import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Get all products
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin) throw new Error('Unauthorized');

    const { pagesize, page } = req.body;
    const product = await productModel.getAllProducts(pagesize, page);

    return res.json({ error: false, product: product[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(handler);
