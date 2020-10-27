import { database } from '../libs/db';

export interface IDiscountInsert {
  title: string;
  description: string;
  date_to: Date;
  percent_discount: number;
  created_by: number;
  products: [number];
}
export interface IDiscountUpdate {
  title?: string;
  description?: string;
  date_to?: Date;
  percent_discount?: number;
}

const discountsTable = 'discounts';
const discountsDetailsTable = 'discounts_details';

export const discountModel = {
  /**
   * Get all discounts (without affected products)
   */
  async getAllDiscounts(): Promise<any> {
    return await database().select('*').from(discountsTable);
  },

  /**
   * Get discount by id (with affected products)
   * @param discountId - Discount id
   */
  async getDiscountById(discountId: number): Promise<any> {
    const discounts = await database()
      .select('*')
      .from(discountsTable)
      .where('discount_id', '=', discountId);
    const discountsDetails = await database()
      .select('*')
      .from(discountsDetailsTable)
      .where('discount_id', '=', discountId);

    return {
      ...discounts[0],
      products: discountsDetails,
    };
  },

  /**
   * Create discount
   * @param data - Discount data
   */
  async createDiscount(data: IDiscountInsert): Promise<any> {
    const discount: any = await database()
      .insert({
        title: data.title,
        description: data.description,
        date_to: data.date_to,
        percent_discount: data.percent_discount,
        created_by: data.created_by,
      })
      .into(discountsTable);

    if (!discount[0].discount_id) return [];

    const productsData = data.products.map((product) => ({
      product_id: product,
    }));
    const products = await database()
      .insert(productsData)
      .into(discountsDetailsTable);

    if (products.length <= 0) {
      await discountModel.deleteDiscount(discount[0].discount_id);
      return [];
    }
    return {
      ...discount[0],
      products,
    };
  },

  /**
   * Update discount (without editing products)
   * @param data - Update discount data
   */
  async editDiscount(discountId: number, data: IDiscountUpdate): Promise<any> {
    return database()
      .update(data)
      .where('discount_id', '=', discountId)
      .from(discountsTable);
  },

  /**
   * Delete discount by id (with products)
   * @param discountId Id discount to delete
   */
  async deleteDiscount(discountId: number): Promise<any> {
    const deletedDiscount = await database()
      .delete()
      .from(discountsTable)
      .where('discount_id', '=', discountId);
    if (deletedDiscount !== 1) return 0;

    await database()
      .delete()
      .from(discountsDetailsTable)
      .where('discount_id', '=', discountId);
    return deletedDiscount;
  },
};
