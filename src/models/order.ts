import { database } from '../libs/db';

const ordersTable = 'orders';
const orderDetailsTable = 'order_detail';

export const orderModel = {
  /**
   * Get all orders
   * @param pageSize - Limit orders to return
   * @param page - Number of page
   */
  async getAllOrders(pageSize = 5, page = 1): Promise<any> {
    const offSet = page === 1 ? 0 : page * pageSize - pageSize;

    return await database()
      .select('*')
      .from(ordersTable)
      .limit(pageSize)
      .offset(offSet);
  },
  /**
   * Get all information about order
   * @param orderId - Order id
   */
  async getOrderById(orderId: number): Promise<any> {
    if (typeof orderId === 'undefined') return [];
    const order = await database()
      .select('*')
      .from(ordersTable)
      .where('order_id', '=', orderId);
    if (!order[0]?.order_id) return [];
    const products = await database()
      .select('*')
      .from(orderDetailsTable)
      .where('order_id', '=', orderId);
    return [
      {
        ...order[0],
        products,
      },
    ];
  },
  /**
   * Edit order status
   * @param orderId - Order id
   * @param status - Status of order
   */
  async editOrderStatus(orderId: number, status: number): Promise<any> {
    if (typeof orderId === 'undefined') return 0;
    return await database()
      .update({ status })
      .from(ordersTable)
      .where('order_id', '=', orderId);
  },
  /**
   * Delete order with returning ordered products amount to quantity
   * @param orderId - Order id
   */
  async deleteOrder(orderId: number): Promise<any> {
    if (typeof orderId === 'undefined') return 0;
    const deletedOrder = await database()
      .delete()
      .from(ordersTable)
      .where('order_id', '=', orderId);
    await database()
      .delete()
      .from(orderDetailsTable)
      .where('order_id', '=', orderId);
    return deletedOrder;
  },
};
