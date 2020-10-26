import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestWithUser, withUser } from '../../../../libs/withUser';
import { createSubcategory } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function createSubcategoryHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  try {
    const user = req.user;
    if (!user?.id) throw new Error('Unauthorized');

    const { categoryid, title } = req.body;
    console.log(categoryid, title);

    const categories = await createSubcategory(user.id, categoryid, title);

    if (!categories[0].category_id) throw new Error('Not create!');

    return res.json({ error: false, categories: [...categories] });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default withUser(createSubcategoryHandler);
