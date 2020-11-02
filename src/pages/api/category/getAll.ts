import { NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { categoryModel } from '../../../models/category';

/**
 * Get all categories with subcategories
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const categories = await categoryModel.getAllCategories();
    const subCategories = await categoryModel.getAllCategories();
    const categoriesData = categories.map((category: any) => {
      return {
        title: category.title,
        id: category.category_id,
        subCategories: subCategories.map((subCategory: any) => {
          if (subCategory.category_id === category.category_id)
            return {
              title: subCategory.title,
              subCategoryId: subCategory.subcategory_id,
            };
        }),
      };
    });
    return res.json({
      categories: categoriesData,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default handler;
