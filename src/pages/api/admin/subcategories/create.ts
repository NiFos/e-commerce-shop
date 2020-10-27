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
    if (!user?.id || !user.admin?.isAdmin || !user.admin?.fullAccess)
      throw new Error('Unauthorized');

    const { categoryid, title } = req.body;

    const categories = await categoryModel.createSubcategory(
      user.id,
      categoryid,
      title
    );

    if (!categories[0].category_id) throw new Error('Not create!');

    return res.json({ error: false, categories: categories[0] });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(createSubcategoryHandler);
