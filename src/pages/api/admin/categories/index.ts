import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * To get all categories
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin) throw new Error('Unauthorized');
    const categories = await categoryModel.getAllCategories();

    return res.json({ error: false, categories });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(handler);
