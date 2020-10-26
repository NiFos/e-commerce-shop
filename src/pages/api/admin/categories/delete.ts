import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCategory } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function deleteCategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { categoryid } = req.query;

    const deletedCategories = await deleteCategory(+categoryid);
    if (deletedCategories !== 1) throw new Error('not found!');

    return res.json({ error: false, deletedId: categoryid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default deleteCategoryHandler;
