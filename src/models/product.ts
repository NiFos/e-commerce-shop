import { database } from '../libs/db';
import { reviewsTable } from './review';

export const productsTable = 'products';
export const productsSalesTable = 'products_sales';
export const tagsTable = 'tags';
export const productsTagsTable = 'products_tags';

export interface IProductDataInsert {
  title: string;
  price: number;
  techspecs?: string;
  description?: string;
  subcategory_id: number;
  quantity: number;
  created_by: number;
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
  async getAllProducts(pageSize = 5, page = 1): Promise<any> {
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
  async getPopularProducts(): Promise<any> {
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
  async getTopRated(): Promise<any> {
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
  async getIds(): Promise<any> {
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
  ): Promise<any> {
    if (typeof subcategoryId === 'undefined') return [];
    return await database()
      .select('*')
      .from(productsTable)
      .whereBetween('price', prices)
      .innerJoin(
        productsTagsTable,
        `${productsTagsTable}.product_id`,
        `${productsTable}.product_id`
      )
      .whereIn(`${productsTagsTable}.tag_id`, tags)
      .andWhere('products.product_id', '>', after)
      .limit(pageSize);
  },
  /**
   * Get product by id
   * @param productId - Product id
   */
  async getProduct(productId: number): Promise<any> {
    if (typeof productId === 'undefined') return false;
    return await database()
      .select('*')
      .from(productsTable)
      .where('product_id', '=', productId)
      .limit(1);
  },
  /**
   * Get last new product
   */
  async getLastNewProduct(): Promise<any> {
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
  async createProduct(data: IProductDataInsert): Promise<any> {
    if (JSON.stringify(data) === '{}') return [];
    const product = await database()
      .insert(data)
      .into(productsTable)
      .returning('*');
    if (product.length <= 0) return [];
    const sales = await database()
      .insert({ product_id: product[0].product_id })
      .into(productsSalesTable)
      .returning('*');
    if (sales.length <= 0) {
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
  async editProduct(productId: number, data: IProductDataUpdate): Promise<any> {
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
  ): Promise<any> {
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
  async deleteProduct(productId: number): Promise<any> {
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
  async searchProducts(name: string): Promise<any> {
    if (typeof name === 'undefined') return [];
    return await database()
      .select('*')
      .from(productsTable)
      .where('title', 'ilike', `%${name}%`);
  },
};
