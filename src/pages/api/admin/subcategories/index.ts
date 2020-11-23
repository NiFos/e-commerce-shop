import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function getAllAdminSubcategoriesHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
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

export default withUser(getAllAdminSubcategoriesHandler);
