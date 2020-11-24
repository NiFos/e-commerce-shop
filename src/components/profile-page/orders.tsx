import { Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  orders: any[];
}

/**
 * Orders component
 */
export function Orders(props: Props): JSX.Element {
  /**
   * Render orders
   */
  function renderOrders() {
    return props.orders.map((order) => {
      return (
        <div key={order.order_id}>
          <div>
            <Typography variant={'h6'}>Order id: {order.order_id}</Typography>
            <Typography variant={'h6'}>Status: {order.status}</Typography>
            <Typography variant={'h6'}>
              Delivery address: {order.delivery_address}
            </Typography>
            <div>Total price {order.totalPrice}</div>
          </div>
          <div>
            {order.products.map((product: any) => (
              <div key={product.product_id}>
                <div>
                  <div>{product.price_one}</div>
                  <div>{product.quantity}</div>
                </div>
                <div>Total price: {product.quantity * product.price_one}</div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  }
  return (
    <div>{props.orders ? renderOrders() : 'You do not have orders yet'}</div>
  );
}
