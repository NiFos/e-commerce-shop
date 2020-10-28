import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Delete subcategory
 */
async function deleteSubcategoryHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (
      typeof user?.id === 'undefined' ||
      !user.admin?.isAdmin ||
      !user.admin?.fullAccess
    )
      throw 'Unauthorized';

    const { subcategoryid } = req.query;

    const deletedCategories = await categoryModel.deleteSubcategory(
      +subcategoryid
    );
    if (deletedCategories !== 1) throw 'not found!';

    return res.json({ deletedId: subcategoryid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(deleteSubcategoryHandler);
