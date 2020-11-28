import { database } from '../libs/db';
import { ITag } from '../pages/admin/products/tags';
import { subCategoriesTable } from './category';
import { reviewsTable } from './review';

export const productsTable = 'products';
export const productsSalesTable = 'products_sales';
export const tagsTable = 'tags';
export const productsTagsTable = 'products_tags';

export interface IProductModel {
  product_id: number;
  title: string;
  techspecs: string;
  description: string;
  price: number;
  quantity: number;
  subcategory_id: number;
  subcategory_title: string;
  created_on: string;
  created_by: number;
  rating: number;
  sales?: number;
  photo?: string;
}

export interface IProductDataInsert {
  title: string;
  price: number;
  techspecs?: string;
  description?: string;
  subcategory_id: number;
  quantity: number;
  created_by: number;
  tags?: number[];
}
export interface IProductDataUpdate {
  title?: string;
  price?: number;
  techspecs?: string;
  description?: string;
  subcategory_id?: number;
  quantity?: number;
}

export const productModel = {
  /**
   * Get all products (for admins)
   * @param pageSize - Page size
   * @param page - Page
   */
  async getAllProducts(pageSize = 5, page = 1): Promise<IProductModel[]> {
    const offSet = page === 1 ? 0 : page * pageSize - pageSize;
    return await database()
      .select('*')
      .from(productsTable)
      .offset(offSet)
      .limit(pageSize + 1);
  },

  /**
   * Get 5 popular products
   */
  async getPopularProducts(): Promise<IProductModel[]> {
    return await database()
      .select('*')
      .from(productsTable)
      .innerJoin(
        productsSalesTable,
        `${productsSalesTable}.product_id`,
        `${productsTable}.product_id`
      )
      .orderBy(`${productsSalesTable}.sales`, 'desc')
      .limit(5);
  },

  /**
   * Get 5 top rated
   */
  async getTopRated(): Promise<
    { product_id?: number; price?: number; title?: string; rating?: number }[]
  > {
    return await database()
      .select(
        `${productsTable}.product_id`,
        `${productsTable}.price`,
        `${productsTable}.title`
      )
      .avg({ rating: 'rating' })
      .from(productsTable)
      .innerJoin(
        reviewsTable,
        `${reviewsTable}.product_id`,
        `${productsTable}.product_id`
      )
      .limit(5)
      .groupBy(`${productsTable}.product_id`)
      .orderBy('rating', 'desc');
  },

  /**
   * Get all products ids
   */
  async getIds(): Promise<{ product_id: number }[]> {
    return await database().select('product_id').from(productsTable);
  },

  /**
   * Get all products in subcategory
   * @param subcategoryId - Subcategory id
   * @param pageSize - Page size
   * @param page - Page
   */
  async getAllProductsInSubcategory(
    subcategoryId: number,
    tags: number[],
    prices: [number, number],
    pageSize = 5,
    after = 0
  ): Promise<IProductModel[]> {
    if (typeof subcategoryId === 'undefined') return [];
    return await database()
      .select('*')
      .from(productsTable)
      .whereBetween('price', prices)
      /* .innerJoin(
        productsTagsTable,
        `${productsTagsTable}.product_id`,
        `${productsTable}.product_id`
      )
      .whereIn(`${productsTagsTable}.tag_id`, tags) */
      .andWhere('products.product_id', '>', after)
      .limit(pageSize);
  },
  /**
   * Get product by id
   * @param productId - Product id
   */
  async getProduct(productId: number): Promise<IProductModel[]> {
    if (typeof productId === 'undefined') return [];
    return await database()
      .select(
        `${productsTable}.*`,
        `${subCategoriesTable}.title as subcategory_title`
      )
      .from(productsTable)
      .where('product_id', '=', productId)
      .innerJoin(
        subCategoriesTable,
        `${subCategoriesTable}.subcategory_id`,
        `${productsTable}.subcategory_id`
      )
      .limit(1);
  },
  /**
   * Get last new product
   */
  async getLastNewProduct(): Promise<IProductModel[]> {
    return await database()
      .select('*')
      .from(productsTable)
      .orderByRaw('RANDOM()')
      .limit(1);
  },
  /**
   * Insert product into products table
   * @param data - Product data: title, number, quantity, tech specs, description, created by
   */
  async createProduct(data: IProductDataInsert): Promise<IProductModel[]> {
    const productData = { ...data };
    delete productData.tags;

    if (JSON.stringify(productData) === '{}') return [];
    const product = await database()
      .insert(productData)
      .into(productsTable)
      .returning('*');
    if (product.length <= 0) return [];
    const tagsData = (data.tags || []).map((item) => ({
      product_id: product[0].product_id,
      tag_id: item,
    }));
    const tags = await database()
      .insert(tagsData)
      .into(productsTagsTable)
      .returning('*');
    const sales = await database()
      .insert({ product_id: product[0].product_id })
      .into(productsSalesTable)
      .returning('*');
    if (sales.length <= 0 || tags.length <= 0) {
      await database()
        .delete()
        .from(productsTable)
        .where({ product_id: product[0].product_id });
      return [];
    }
    return product;
  },
  /**
   * Update product data
   * @param data data - Product data: title, number, quantity, tech specs, description
   */
  async editProduct(
    productId: number,
    data: IProductDataUpdate
  ): Promise<number> {
    if (typeof productId === 'undefined' || JSON.stringify(data) === '{}')
      return 0;
    return await database()
      .update(data)
      .from(productsTable)
      .where('product_id', '=', productId);
  },
  /**
   *
   * @param plus - If true - Increment amount, false - Decrement
   * @param amount - Amount
   */
  async editQuantityProduct(
    productId: number,
    plus: boolean,
    amount: number
  ): Promise<number> {
    if (typeof productId === 'undefined' || typeof amount === 'undefined')
      return 0;
    if (plus) {
      return await database()
        .table(productsTable)
        .increment('quantity', amount)
        .where('product_id', '=', productId);
    } else {
      return await database()
        .table(productsTable)
        .decrement('quantity', amount)
        .where('product_id', '=', productId);
    }
  },
  /**
   * Delete product
   * @param productId - Product id to delete
   */
  async deleteProduct(productId: number): Promise<number> {
    if (typeof productId === 'undefined') return 0;
    return await database()
      .delete()
      .from(productsTable)
      .where('product_id', '=', productId);
  },

  /**
   * Search products by name
   * @param name - Search name
   */
  async searchProducts(name: string): Promise<IProductModel[]> {
    if (typeof name === 'undefined') return [];
    return await database()
      .select('*')
      .from(productsTable)
      .where('title', 'ilike', `%${name}%`);
  },

  /**
   * Create tag
   * @param title - Tag title
   */
  async createTag(title: string): Promise<ITag[]> {
    if (typeof title === 'undefined') return [];
    return await database()
      .insert({
        title,
      })
      .into(tagsTable)
      .returning('*');
  },

  /**
   * Get tags
   */
  async getTags(): Promise<ITag[]> {
    return await database().select('*').from(tagsTable);
  },
};
