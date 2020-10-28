import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * Create subcategory
 */
async function createSubcategoryHandler(
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

    const { categoryid, title } = req.body;

    const categories = await categoryModel.createSubcategory(
      user.id,
      categoryid,
      title
    );

    if (!categories[0]?.category_id) throw 'Not create!';

    return res.json({ categories: categories[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withUser(createSubcategoryHandler);
