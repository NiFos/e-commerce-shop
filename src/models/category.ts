import { database } from '../libs/db';
import { productsTable, productsTagsTable, tagsTable } from './product';

export interface ICategoryModel {
  category_id: number;
  created_on: Date;
  title: string;
}

export interface ISubcategoryModel {
  category_id: number;
  subcategory_id: number;
  created_on: Date;
  title: string;
}

export interface ISubcategoryData {
  prices: [number, number];
  tags: { tag_id: number; title: string }[];
}

export const categoriesTable = 'categories';
export const subCategoriesTable = 'subcategories';

/**
 * Category model
 */
export const categoryModel = {
  /**
   * Get all categories from database
   */
  async getAllCategories(): Promise<ICategoryModel[]> {
    return await database().select('*').from(categoriesTable);
  },
  /**
   * Get all categories from database
   */
  async getAllSubcategories(categoryId?: number): Promise<ISubcategoryModel[]> {
    if (typeof categoryId === 'undefined') {
      return await database().select('*').from(subCategoriesTable);
    }
    return await database()
      .select('*')
      .from(subCategoriesTable)
      .where('category_id', '=', categoryId);
  },

  /**
   * Get subcategory by id
   * @param subcategoryId - Subcategory id
   */
  async getSubcategory(subcategoryId: number): Promise<ISubcategoryModel[]> {
    return await database()
      .select('*')
      .from(subCategoriesTable)
      .where('subcategory_id', '=', subcategoryId);
  },

  /**
   * Get subcategory data, such as: tags, prices
   * @param subcategoryId - Subcategory id
   */
  async getSubcategoryData(subcategoryId: number): Promise<ISubcategoryData> {
    const pricesData: { min?: number; max?: number }[] = await database()
      .min({ min: 'price' })
      .max({ max: 'price' })
      .from(productsTable)
      .where('subcategory_id', '=', subcategoryId);
    const tags = await database()
      .select(`${tagsTable}.tag_id`, `${tagsTable}.title`)
      .distinct()
      .from(productsTable)
      .innerJoin(
        productsTagsTable,
        `${productsTable}.product_id`,
        `${productsTagsTable}.product_id`
      )
      .where(`${productsTable}.subcategory_id`, '=', subcategoryId)
      .innerJoin(
        tagsTable,
        `${productsTagsTable}.tag_id`,
        `${tagsTable}.tag_id`
      );
    return {
      prices: [pricesData[0].min || 0, pricesData[0].max || 0],
      tags,
    };
  },

  /**
   * Create new category
   * @param title - name of new category
   */
  async createCategory(
    createdBy: number,
    title: string
  ): Promise<ICategoryModel[]> {
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
  async editCategory(categoryId: number, newTitle: string): Promise<number> {
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
  async deleteCategory(categoryId: number): Promise<number> {
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
  async deleteSubcategory(subcategoryId: number): Promise<number> {
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
  ): Promise<ISubcategoryModel[]> {
    if (
      typeof createdBy === 'undefined' ||
      typeof categoryId === 'undefined' ||
      !title
    )
      return [];
    return await database()
      .insert({ category_id: categoryId, created_by: createdBy, title })
      .into(subCategoriesTable)
      .returning('*');
  },

  /**
   * @param categoryId Id category to update
   * @param newTitle New title of category
   */
  async editSubcategory(
    subcategoryId: number,
    newTitle: string
  ): Promise<number> {
    if (typeof subcategoryId === 'undefined' || !newTitle) return 0;
    return await database()
      .update({ title: newTitle })
      .where('subcategory_id', '=', subcategoryId)
      .from(subCategoriesTable);
  },
};
