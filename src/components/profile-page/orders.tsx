import {
  Card,
  CardContent,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { IUserOrderModel } from '../../models/order';

const useStyles = makeStyles({
  order: {
    marginBottom: '10px',
  },
  orderContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

interface Props {
  orders: IUserOrderModel[];
}

/**
 * Orders component
 */
export function Orders(props: Props): JSX.Element {
  const classes = useStyles();
  /**
   * Render orders
   */
  function renderOrders() {
    return props.orders.map((order) => {
      return (
        <Card key={order.order_id} className={classes.order}>
          <CardContent className={classes.orderContent}>
            <div>
              <Typography variant={'h6'}>Order id: {order.order_id}</Typography>
              <Typography variant={'h6'}>Status: {order.status}</Typography>
              <Typography variant={'h6'}>
                Delivery address: {order.delivery_address}
              </Typography>
              <div>Total price {order.totalPrice}</div>
            </div>
            <div>
              <Divider orientation={'vertical'} />
            </div>
            <div>
              {order.products.map((product) => (
                <div key={product.product_id}>
                  <div className={classes.productHeader}>
                    <div>{product.title}</div>
                    <div>Price: {product.price_one} USD</div>
                    <div>Quantity: {product.quantity}</div>
                  </div>
                  <div>Total price: {product.quantity * product.price_one}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    });
  }
  return (
    <div>{props.orders ? renderOrders() : 'You do not have orders yet'}</div>
  );
}
