import { NextApiResponse } from 'next';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser } from '../../../libs/withUser';
import { categoryModel } from '../../../models/category';

export interface ICategory {
  title: string;
  category_id: number;
}
export interface IPublicCategory {
  title: string;
  id: number;
  subcategories: { title: string; id: number }[];
}
export interface ISubcategory {
  title: string;
  subcategory_id: number;
}

/**
 * Get all categories with subcategories
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const categories = await categoryModel.getAllCategories();
    const subCategories = await categoryModel.getAllSubcategories();
    const categoriesData = categories.map((category) => {
      return {
        title: category.title,
        id: category.category_id,
        subcategories: subCategories.map((subcategory) => {
          if (subcategory.category_id === category.category_id)
            return {
              title: subcategory.title,
              id: subcategory.subcategory_id,
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

export default withMethod(handler, 'GET');
