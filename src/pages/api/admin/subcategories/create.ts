import { NextApiRequest, NextApiResponse } from 'next';
import { createSubcategory } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function createSubcategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = 0;
    const { categoryid, title } = req.body;
    console.log(categoryid, title);

    const categories = await createSubcategory(user, categoryid, title);

    if (!categories[0].category_id) throw new Error('Not create!');

    return res.json({ error: false, categories: [...categories] });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default createSubcategoryHandler;
