import { database } from '../libs/db';

const categoriesTable = 'categories';
const subCategoriesTable = 'subcategories';

/**
 * Get all categories from database
 */
export async function getAllCategories(): Promise<any> {
  return await database().select('*').from(categoriesTable);
}
/**
 * Get all categories from database
 */
export async function getAllSubcategories(categoryId: number): Promise<any> {
  return await database()
    .select('*')
    .from(subCategoriesTable)
    .where('category_id', '=', categoryId);
}

/**
 * Create new category
 * @param title - name of new category
 */
export async function createCategory(
  createdBy: number,
  title: string
): Promise<any> {
  return await database()
    .insert({ created_by: createdBy, title })
    .into(categoriesTable)
    .returning('*');
}

/**
 * @param categoryId Id category to update
 * @param newTitle New title of category
 */
export async function editCategory(categoryId: number, newTitle: string) {
  return await database()
    .update({ title: newTitle })
    .where('category_id', '=', categoryId)
    .from(categoriesTable);
}

/**
 * Delete category
 * @param categoryId Id category
 */
export async function deleteCategory(categoryId: number) {
  return await database()
    .delete()
    .from(categoriesTable)
    .where('category_id', '=', categoryId);
}
/**
 * Delete category
 * @param categoryId Id category
 */
export async function deleteSubcategory(subcategoryId: number) {
  return await database()
    .delete()
    .from(subCategoriesTable)
    .where('category_id', '=', subcategoryId);
}

/**
 * Create new subcategory
 * @param title - name of new category
 */
export async function createSubcategory(
  createdBy: number,
  categoryId: number,
  title: string
): Promise<any> {
  return await database()
    .insert({ category_id: categoryId, created_by: createdBy, title })
    .into(subCategoriesTable)
    .returning('*');
}

/**
 * @param categoryId Id category to update
 * @param newTitle New title of category
 */
export async function editSubcategory(subcategoryId: number, newTitle: string) {
  return await database()
    .update({ title: newTitle })
    .where('category_id', '=', subcategoryId)
    .from(subCategoriesTable);
}
