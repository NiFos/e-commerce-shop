import { NextApiRequest, NextApiResponse } from 'next';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { categoryid, title } = req.body;
    const categories = await categoryModel.editCategory(categoryid, title);
    console.log(categories);

    if (categories <= 0) throw new Error('not found!');

    return res.json({ error: false, category: { categoryid, title } });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}
