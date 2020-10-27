import { NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function createCategoryHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id) throw new Error('Unauthorized');

    const { title } = req.body;
    const categories = await categoryModel.createCategory(user.id, title);
    if (!categories[0].category_id) throw new Error('Not create!');

    return res.json({ error: false, categories: [...categories] });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(createCategoryHandler);
