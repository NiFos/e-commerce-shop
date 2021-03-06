import { NextApiResponse } from 'next';
import { withMethod } from '../../../../libs/withMethod';
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

    const { id } = req.query;

    const deletedCategories = await categoryModel.deleteSubcategory(+id);
    if (deletedCategories !== 1) throw 'not found!';

    return res.json({ deletedId: id });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(deleteSubcategoryHandler), 'DELETE');
