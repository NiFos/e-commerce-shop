import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Edit category
 */
async function editSubcategoryHandler(
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

    const { subcategoryid, title } = req.body;
    const categories = await categoryModel.editSubcategory(
      subcategoryid,
      title
    );
    if (categories <= 0) throw 'not found!';

    return res.json({ category: { subcategoryid, title } });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(editSubcategoryHandler);
