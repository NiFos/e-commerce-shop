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
    if (!user?.id || !user.admin?.isAdmin) throw new Error('Unauthorized');
    const { categoryid } = req.query;
    const subcategories = await categoryModel.getAllSubcategories(+categoryid);

    return res.json({ error: false, subcategories });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(getAllAdminSubcategoriesHandler);
