import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Get all subcategories
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined' || !user.admin?.isAdmin)
      throw 'Unauthorized';

    const { categoryId } = req.query;
    const subcategories = await categoryModel.getAllSubcategories(+categoryId);

    return res.json({ subcategories });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(handler), 'GET');
