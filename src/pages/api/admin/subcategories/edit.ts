import { NextApiRequest, NextApiResponse } from 'next';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
async function editSubcategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { subcategoryid, title } = req.body;
    const categories = await categoryModel.editSubcategory(
      subcategoryid,
      title
    );
    console.log(categories);

    if (categories <= 0) throw new Error('not found!');

    return res.json({ error: false, category: { subcategoryid, title } });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}

export default editSubcategoryHandler;
