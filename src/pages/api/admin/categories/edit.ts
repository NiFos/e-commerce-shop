import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Edit category handler
 */
async function editCategoriesHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { categoryid, title } = req.body;

    const categories = await categoryModel.editCategory(categoryid, title);
    if (categories <= 0) throw new Error('not found!');

    return res.json({ error: false, category: { categoryid, title } });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(editCategoriesHandler);
