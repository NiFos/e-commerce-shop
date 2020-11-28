import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { productModel } from '../../../../models/product';

/**
 * Create tag
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

    const { title } = req.body;

    const tag = await productModel.createTag(title);

    if (!tag[0]?.tag_id) throw 'Not created!';

    return res.json(tag);
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withMethod(withUser(handler), 'POST');
