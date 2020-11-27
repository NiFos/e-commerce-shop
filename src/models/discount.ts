import { database } from '../libs/db';

export interface IDiscountModel {
  discount_id: number;
  title: string;
  description: string;
  date_to: string;
  created_on: string;
  percent_discount: number;
  promocode: string;
  photo?: string;
}

export interface IDiscountInsert {
  title: string;
  description: string;
  date_to: string;
  percent_discount: number;
  created_by: number;
  promocode: string;
}
export interface IDiscountUpdate {
  title?: string;
  description?: string;
}

export const discountsTable = 'discounts';

export const discountModel = {
  /**
   * Get all discounts (without affected products)
   */
  async getAllDiscounts(): Promise<IDiscountModel[]> {
    return await database().select('*').from(discountsTable);
  },

  /**
   * Get random discount
   */
  async getRandomDiscount(): Promise<IDiscountModel[]> {
    return await database()
      .select('*')
      .from(discountsTable)
      .limit(1)
      .orderByRaw('RANDOM()');
  },

  /**
   * Get discount by id
   * @param discountId - Discount id
   */
  async getDiscountById(discountId: number): Promise<IDiscountModel[]> {
    if (typeof discountId === 'undefined') return [];
    const discounts = await database()
      .select('*')
      .from(discountsTable)
      .where('discount_id', '=', discountId);
    if (discounts[0]?.discount_id) return [];

    return discounts;
  },

  /**
   * Get discount by promocode
   * @param promocode - Promocode
   */
  async getDiscountByPromocode(promocode: string): Promise<IDiscountModel[]> {
    if (typeof promocode === 'undefined') return [];
    const discounts = await database()
      .select('*')
      .from(discountsTable)
      .where('promocode', '=', promocode.toUpperCase());
    return discounts;
  },

  /**
   * Create discount
   * @param data - Discount data
   */
  async createDiscount(data: IDiscountInsert): Promise<IDiscountModel[]> {
    if (JSON.stringify(data) === '{}') return [];
    const discount = await database()
      .insert({
        title: data.title,
        description: data.description,
        date_to: data.date_to,
        percent_discount: data.percent_discount,
        created_by: data.created_by,
        promocode: data.promocode.toUpperCase(),
      })
      .into(discountsTable)
      .returning('*');

    if (!discount[0]?.discount_id) return [];
    return [discount[0]];
  },

  /**
   * Update discount (without editing products)
   * @param data - Update discount data
   */
  async editDiscount(
    discountId: number,
    data: IDiscountUpdate
  ): Promise<number> {
    if (typeof discountId === 'undefined' || JSON.stringify(data) === '{}')
      return 0;
    return database()
      .update(data)
      .where('discount_id', '=', discountId)
      .from(discountsTable);
  },

  /**
   * Delete discount by id (with products)
   * @param discountId Id discount to delete
   */
  async deleteDiscount(discountId: number): Promise<number> {
    if (typeof discountId === 'undefined') return 0;
    const deletedDiscount = await database()
      .delete()
      .from(discountsTable)
      .where('discount_id', '=', discountId);
    if (deletedDiscount !== 1) return 0;
    return deletedDiscount;
  },
};
