import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Delete product
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const {
      title,
      price,
      quantity,
      techspecs,
      description,
      subcategoryid,
    } = req.body;

    const product = await productModel.createProduct({
      created_by: user.id,
      price,
      quantity,
      subcategory_id: subcategoryid,
      title,
      description,
      techspecs,
    });

    if (!product[0]?.product_id) throw 'Not create!';

    return res.json({ product: product[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
