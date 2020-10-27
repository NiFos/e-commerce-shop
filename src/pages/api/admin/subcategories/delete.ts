import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function deleteSubcategoryHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { subcategoryid } = req.query;

    const deletedCategories = await categoryModel.deleteSubcategory(
      +subcategoryid
    );
    if (deletedCategories !== 1) throw new Error('not found!');

    return res.json({ error: false, deletedId: subcategoryid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(deleteSubcategoryHandler);
