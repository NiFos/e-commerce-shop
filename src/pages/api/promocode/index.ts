import { NextApiResponse } from 'next';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { discountModel } from '../../../models/discount';

/**
 * Get information about promocode
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { promocode } = req.body;
    const discountInformation = await discountModel.getDiscountByPromocode(
      promocode
    );
    return res.json({
      discount: {
        percentage: discountInformation[0]?.percent_discount,
        promocode: discountInformation[0]?.promocode,
        title: discountInformation[0]?.title,
        description: discountInformation[0]?.description,
        dateTo: discountInformation[0]?.date_to,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(handler, 'POST');
