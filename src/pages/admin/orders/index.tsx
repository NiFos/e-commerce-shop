import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '../../../libs/withUser';
import { orderModel } from '../../../models/order';
import {
  editOrderStatus,
  getChartData,
  getFeed,
  getOrder,
  getOrders,
} from '../../../redux/reducers/orders';
import { initializeStore, RootState } from '../../../redux/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface IOrder {
  orderId: number;
  status: number;
  orderDate: number;
}
interface Props {
  children?: any;
  orders: IOrder[];
  feed: any[];
  chartData: any[];
}

/**
 * Orders page
 */
export default function Component(props: Props): JSX.Element {
  const [currentOrder, setCurrentOrder] = React.useState(-1);
  const [currentOrderStatus, setCurrentOrderStatus] = React.useState(-1);
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.orders);
  const userState = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (typeof state?.currentOrder?.status !== 'undefined') {
      setCurrentOrderStatus(state?.currentOrder?.status);
    }
  }, [state]);

  /**
   * Edit handler
   * @param orderId - Order id
   */
  function editHandler(orderId: number) {
    if (currentOrder !== orderId) {
      setCurrentOrder(orderId);
      dispatch(getOrder(orderId));
    }
  }

  /**
   * Clean current order data
   */
  function cleanCurrentOrder() {
    setCurrentOrder(-1);
    setCurrentOrderStatus(-1);
  }

  /**
   * Edit order status
   * @param value - Status number
   */
  function editStatusHandler() {
    dispatch(editOrderStatus(currentOrder, currentOrderStatus));
  }

  /**
   * Render orders
   */
  function renderOrders() {
    return props.orders.map((order) => (
      <div key={order.orderId}>
        <div>{order.orderId}</div>
        <div>{order.status}</div>
        <div>{moment(order.orderDate * 1000).format('lll')}</div>
        <Button
          onClick={() => editHandler(order.orderId)}
          disabled={!userState.me?.user?.admin.fullAccess}
        >
          Edit
        </Button>
      </div>
    ));
  }

  return (
    <Container>
      {/* Edit order modal */}
      <Dialog open={currentOrder !== -1} onClose={cleanCurrentOrder}>
        <DialogTitle>Order id - {currentOrder}</DialogTitle>
        <DialogContent>
          {state?.currentOrderLoadingStatus === 'loaded' ? (
            <Select
              value={currentOrderStatus}
              onChange={(e) => setCurrentOrderStatus(e.target.value as number)}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          ) : state?.currentOrderLoadingStatus === 'loading' ? (
            <div>Loading...</div>
          ) : (
            <div>Something went wrong</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanCurrentOrder}>Cancel</Button>
          <Button
            onClick={editStatusHandler}
            disabled={state?.currentOrderLoadingStatus !== 'loaded'}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Component */}
      <Typography variant={'h5'}>Orders</Typography>
      <div>
        {/* Header */}
        <div>
          {/* Feed */}
          <div>Feed</div>
          {props.feed.map((item) => (
            <div key={item.statusId}>
              {item.statusId} - {item.count}
            </div>
          ))}
        </div>

        {/* Chart */}
        <div>
          <div>Last year data</div>
          <div>
            <LineChart data={props?.chartData}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div>
        <div>
          <span>Order id</span>
          <span>Status</span>
          <span>Order date</span>
          <span></span>
        </div>
        <div>{renderOrders()}</div>
      </div>
    </Container>
  );
}

/**
 * Ssr props
 */
export async function getServerSideProps(context: any) {
  const userData = checkUser(context.req);
  if (typeof userData?.user?.id === 'undefined')
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore({});
  const { pagesize, page } = context.query;

  const orders = await orderModel.getAllOrders(+pagesize, +page);
  await reduxStore.dispatch(getOrders(orders));

  const feed = await orderModel.getFeed();
  await reduxStore.dispatch(
    getFeed(
      feed.map((item: any) => ({ statusId: item.status, count: item.count }))
    )
  );

  const ordersByMonth = await orderModel.getOrdersByMonth();
  const chartData = ordersByMonth.map((item: any, index: number) => ({
    name: item.created_on,
    uv: item.count,
    pv: index,
  }));
  await reduxStore.dispatch(getChartData(chartData));

  return {
    props: {
      feed: [{ statusId: 0, count: 1 }] /* reduxStore.getState().orders.feed */,
      chartData: [
        { name: 'January', uv: 10, pv: 0 },
        { name: 'February', uv: 5, pv: 1 },
        { name: 'March', uv: 25, pv: 2 },
      ] /* reduxStore.getState().orders.chartData */,
      orders: [
        { orderId: 0, status: 0, orderDate: 1604995348 },
      ] /* reduxStore.getState().orders.orders */,
    },
  };
}
