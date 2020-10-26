import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSubcategory } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function deleteSubcategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { subcategoryid } = req.query;

    const deletedCategories = await deleteSubcategory(+subcategoryid);
    if (deletedCategories !== 1) throw new Error('not found!');

    return res.json({ error: false, deletedId: subcategoryid });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default deleteSubcategoryHandler;
