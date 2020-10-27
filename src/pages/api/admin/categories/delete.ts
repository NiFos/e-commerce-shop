import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Delete category handler
 */
async function deleteCategoryHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { categoryid } = req.query;

    const deletedCategories = await categoryModel.deleteCategory(+categoryid);
    if (deletedCategories !== 1) throw new Error('not found!');

    return res.json({ error: false, deletedId: categoryid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(deleteCategoryHandler);
