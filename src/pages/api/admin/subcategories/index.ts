import { NextApiRequest, NextApiResponse } from 'next';
import { categoryModel } from '../../../../models/category';

/**
 * To get all subcategories
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { categoryid } = req.query;
    const subcategories = await categoryModel.getAllSubcategories(+categoryid);

    return res.json({ error: false, subcategories });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}
