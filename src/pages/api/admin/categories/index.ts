import { NextApiRequest, NextApiResponse } from 'next';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await categoryModel.getAllCategories();

    return res.json({ error: false, categories });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}
