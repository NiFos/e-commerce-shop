import { database } from '../libs/db';

const categoriesTable = 'categories';
const subCategoriesTable = 'subcategories';

/**
 * Category model
 */
export const categoryModel = {
  /**
   * Get all categories from database
   */
  async getAllCategories(): Promise<any> {
    return await database().select('*').from(categoriesTable);
  },
  /**
   * Get all categories from database
   */
  async getAllSubcategories(categoryId: number): Promise<any> {
    return await database()
      .select('*')
      .from(subCategoriesTable)
      .where('category_id', '=', categoryId);
  },

  /**
   * Create new category
   * @param title - name of new category
   */
  async createCategory(createdBy: number, title: string): Promise<any> {
    if (typeof createdBy === 'undefined' || !title) return [];
    return await database()
      .insert({ created_by: createdBy, title })
      .into(categoriesTable)
      .returning('*');
  },

  /**
   * @param categoryId Id category to update
   * @param newTitle New title of category
   */
  async editCategory(categoryId: number, newTitle: string): Promise<any> {
    if (typeof categoryId === 'undefined' || !newTitle) return 0;
    return await database()
      .update({ title: newTitle })
      .where('category_id', '=', categoryId)
      .from(categoriesTable);
  },

  /**
   * Delete category
   * @param categoryId Id category
   */
  async deleteCategory(categoryId: number): Promise<any> {
    if (typeof categoryId === 'undefined') return 0;
    return await database()
      .delete()
      .from(categoriesTable)
      .where('category_id', '=', categoryId);
  },
  /**
   * Delete category
   * @param categoryId Id category
   */
  async deleteSubcategory(subcategoryId: number): Promise<any> {
    if (typeof subcategoryId === 'undefined') return 0;
    return await database()
      .delete()
      .from(subCategoriesTable)
      .where('category_id', '=', subcategoryId);
  },

  /**
   * Create new subcategory
   * @param title - name of new category
   */
  async createSubcategory(
    createdBy: number,
    categoryId: number,
    title: string
  ): Promise<any> {
    if (
      typeof createdBy === 'undefined' ||
      typeof categoryId === 'undefined' ||
      !title
    )
      return 0;
    return await database()
      .insert({ category_id: categoryId, created_by: createdBy, title })
      .into(subCategoriesTable)
      .returning('*');
  },

  /**
   * @param categoryId Id category to update
   * @param newTitle New title of category
   */
  async editSubcategory(subcategoryId: number, newTitle: string): Promise<any> {
    if (typeof subcategoryId === 'undefined' || !newTitle) return 0;
    return await database()
      .update({ title: newTitle })
      .where('subcategory_id', '=', subcategoryId)
      .from(subCategoriesTable);
  },
};
