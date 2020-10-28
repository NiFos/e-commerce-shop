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
      subcategoryid,
      productid,
    } = req.body;

    const data: IProductDataUpdate = {};
    if (title) data.title = title;
    if (price) data.price = price;
    if (description) data.description = description;
    if (techspecs) data.techspecs = techspecs;
    if (quantity) data.quantity = quantity;
    if (subcategoryid) data.subcategory_id = subcategoryid;

    const product = await productModel.editProduct(+productid, data);

    if (product <= 0) throw 'Not edited!';

    return res.json({
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
      message: error.toString(),
    });
  }
}

export default withUser(handler);
