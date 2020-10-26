import { NextApiRequest, NextApiResponse } from 'next';
import { createCategory } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function createCategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = 0;
    const { title } = req.body;
    const categories = await createCategory(user, title);
    if (!categories[0].category_id) throw new Error('Not create!');

    return res.json({ error: false, categories: [...categories] });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default createCategoryHandler;
