import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Create product
 */
async function createProductHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { productid } = req.body;

    const product = await productModel.deleteProduct(productid);

    if (product !== 1) throw new Error('Not found!');

    return res.json({ error: false, deletedId: productid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(createProductHandler);
