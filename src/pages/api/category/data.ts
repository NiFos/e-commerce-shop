import { NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { categoryModel } from '../../../models/category';

/**
 * Category data, such as: tags, prices
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const { subcategoryid } = req.body;
    const subcategory = await categoryModel.getSubcategory(+subcategoryid);
    const subcategoryData = await categoryModel.getSubcategoryData(
      +subcategoryid
    );

    return res.json({
      subCategory: {
        id: subcategory[0]?.subcategory_id,
        title: subcategory[0]?.title,
      },
      tags: subcategoryData?.tags,
      prices: subcategoryData?.prices,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default handler;
