import { database } from '../libs/db';
import { discountModel } from './discount';
import { productsSalesTable } from './product';

export const ordersTable = 'orders';
export const orderDetailsTable = 'order_detail';

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
      .limit(pageSize + 1)
      .offset(offSet);
  },

  /**
   * Get all orders
   * @param pageSize - Limit orders to return
   * @param page - Number of page
   */
  async getFeed(): Promise<any> {
    return await database()
      .select('status', database().raw('COUNT(*)'))
      .from(ordersTable)
      .groupByRaw('ROLLUP(status)');
  },

  /**
   * Get orders by month (last year)
   */
  async getOrdersByMonth(): Promise<any> {
    return await database()
      .select(database().raw(`${'date_trunc'}('month', created_on)`))
      .from(ordersTable)
      .groupByRaw('1');
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
   * Create order
   * @param userId - User id
   * @param deliveryAddress - Delivery address
   */
  async createOrder(
    userId: number,
    deliveryAddress: string,
    status: number,
    promocode: string,
    products: any[]
  ): Promise<any> {
    if (typeof userId === 'undefined') return [];

    const order = await database()
      .insert({
        delivery_address: deliveryAddress,
        ordered_by: userId,
        status,
      })
      .into(ordersTable)
      .returning('*');
    if (order.length <= 0) return [];

    const discount = await discountModel.getDiscountByPromocode(promocode);
    const productsData = products.map((product) => {
      const discountPercentage = discount[0]?.percent_discount || 0;
      const price =
        (product.price.unit_amount / 100) * ((100 - discountPercentage) / 100);

      return {
        order_id: order[0].order_id,
        product_id: +product.description,
        quantity: product.quantity,
        price_one: price,
      };
    });

    const orderDetails = await database()
      .insert(productsData)
      .into(orderDetailsTable)
      .returning('*');
    if (orderDetails.length <= 0) {
      await database()
        .delete()
        .from(ordersTable)
        .where({ order_id: order[0].order_id });
      return [];
    }
    orderDetails.forEach(async (detail) => {
      await database()
        .increment('sales', detail.quantity)
        .table(productsSalesTable);
    });
    return [
      {
        orderId: order[0].order_id,
        status: order[0].status,
        deliveryAddress: order[0].delivery_address,
        products: orderDetails.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          priceOne: item.price_one,
        })),
      },
    ];
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

  /**
   * Get all user orders
   * @param userId - User id
   */
  async getUserOrders(userId: number): Promise<any> {
    const orders = await database()
      .select('*')
      .from(ordersTable)
      .where('ordered_by', '=', userId);
    if (!orders[0]?.order_id) return [];

    const ordersIds = orders.map((item) => item.order_id);
    const details = await database()
      .select('*')
      .from(orderDetailsTable)
      .whereIn('order_id', ordersIds);
    if (!orders[0]?.order_id) return [];

    const response = orders.map((order) => {
      const products = details.filter(
        (product) => product.order_id === order.order_id
      );
      return {
        ...order,
        totalPrice: products.reduce(
          (sum, currentValue) =>
            sum + currentValue.price_one * currentValue.quantity,
          0
        ),
        products,
      };
    });
    return response;
  },
};
