import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { discountModel } from '../../../models/discount';
import { productModel } from '../../../models/product';

/**
 * Add product to cart
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const mainDiscount = await discountModel.getRandomDiscount();
    const lastNewProduct = await productModel.getLastNewProduct();
    const popular = await productModel.getPopularProducts();
    const topRated = await productModel.getTopRated();
    return res.json({
      mainDiscount: {
        discountId: mainDiscount[0]?.discount_id,
        title: mainDiscount[0]?.title,
        description: mainDiscount[0]?.description,
        percentDiscount: mainDiscount[0]?.percent_discount,
        to: mainDiscount[0]?.date_to,
      },
      lastNewProduct: {
        productId: lastNewProduct[0]?.product_id,
        title: lastNewProduct[0]?.title,
        price: lastNewProduct[0]?.price,
      },
      popular: popular.map((item: any) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
      })),
      topRated: topRated.map((item: any) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
        rating: item?.rating,
      })),
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(handler);
