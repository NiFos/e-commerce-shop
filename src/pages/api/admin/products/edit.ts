import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { IProductDataUpdate, productModel } from '../../../../models/product';

/**
 * Edit product
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
      subcategoryId,
      productId,
    } = req.body;

    const data: IProductDataUpdate = {};
    if (title) data.title = title;
    if (price) data.price = price;
    if (description) data.description = description;
    if (techspecs) data.techspecs = techspecs;
    if (quantity) data.quantity = quantity;
    if (subcategoryId) data.subcategory_id = subcategoryId;

    const product = await productModel.editProduct(+productId, data);

    if (product <= 0) throw 'Not edited!';

    return res.json({
      product: {
        title,
        price,
        quantity,
        techSpecs: techspecs,
        description,
        subcategoryId,
        productId: productId,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
