import { database } from '../libs/db';

const productsTable = 'products';

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
  async getAllProducts(pageSize: number, page: number): Promise<any> {
    const offSet = page === 1 ? 0 : page * pageSize - pageSize;
    return await database()
      .select('*')
      .from(productsTable)
      .offset(offSet)
      .limit(pageSize);
  },
  /**
   * Get product by id
   * @param productId - Product id
   */
  async getProduct(productId: number): Promise<any> {
    return await database()
      .select('*')
      .from(productsTable)
      .where('product_id', '=', productId)
      .limit(1);
  },
  /**
   * Insert product into products table
   * @param data - Product data: title, number, quantity, tech specs, description, created by
   */
  async createProduct(data: IProductDataInsert): Promise<any> {
    return await database().insert(data).into(productsTable);
  },
  /**
   * Update product data
   * @param data data - Product data: title, number, quantity, tech specs, description
   */
  async editProduct(productId: number, data: IProductDataUpdate): Promise<any> {
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
    return await database()
      .delete()
      .from(productsTable)
      .where('product_id', '=', productId);
  },
};
