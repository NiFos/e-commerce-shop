import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Edit product
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const {
      title,
      price,
      quantity,
      techspecs,
      description,
      subcategoryid,
      productid,
    } = req.body;

    const product = await productModel.editProduct(productid, {
      price,
      quantity,
      subcategory_id: subcategoryid,
      title,
      description,
      techspecs,
    });

    if (product <= 0) throw new Error('Not edited!');

    return res.json({
      error: false,
      product: {
        title,
        price,
        quantity,
        techSpecs: techspecs,
        description,
        subcategoryId: subcategoryid,
        productId: productid,
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
