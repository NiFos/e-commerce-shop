import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Pagination } from '../../../components/Pagination';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import i18n from '../../../../i18n';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    marginTop: '20px',
    marginBottom: '20px',
  },
  feed: {
    width: '22%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  chart: {
    width: '75%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: '20px',
    },
  },
  chartResp: {
    width: '500',
    height: '150',
  },
  ordersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '25%',
      textAlign: 'left',
    },
  },
  order: {
    marginTop: '10px',
    '& > *': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
}));

interface IOrder {
  order_id: number;
  status: number;
  created_on: number;
}
interface Props {
  children?: JSX.Element[];
  orders: IOrder[];
  hasMore: boolean;
  page: number;
  feed: {
    status: number;
    count: number;
  }[];
  chartData: {
    name: string;
    uv: number;
    pv: number;
  }[];
}

/**
 * Orders page
 */
export default function Component(props: Props): JSX.Element {
  const classes = useStyles();
  const { t } = i18n.useTranslation(['admin', 'orders']);
  const [currentOrder, setCurrentOrder] = React.useState(-1);
  const [currentOrderStatus, setCurrentOrderStatus] = React.useState(-1);
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.orders);
  const userState = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (typeof state?.currentOrder?.status !== 'undefined') {
      setCurrentOrderStatus(state?.currentOrder?.status);
    }
  }, [state]);

  /**
   *
   * @param next If true current page +1
   */
  function pagination(next: boolean) {
    const currentPage = router.query.page || 1;
    router.push({
      pathname: router.pathname,
      query: `page=${next ? '' + (+currentPage + 1) : '' + (+currentPage - 1)}`,
    });
  }

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
    return (props.orders || []).map((order) => (
      <Card key={order.order_id} className={classes.order}>
        <CardContent>
          <div>{order.order_id}</div>
          <div>
            {t('orders:order-status.status', { context: '' + order.status })}
          </div>
          <div>{moment(order.created_on).format('lll')}</div>
          <Button
            onClick={() => editHandler(order.order_id)}
            disabled={!userState.me?.user?.admin.fullAccess}
          >
            {t('admin:edit')}
          </Button>
        </CardContent>
      </Card>
    ));
  }

  /**
   * Render products in order modal
   */
  function renderProducts() {
    return (state.currentOrder?.products || []).map((item) => (
      <div key={item.product_id}>
        <Typography>{item.title}</Typography>
        <Typography>
          {t('admin:quantity')}: {item.quantity}
        </Typography>
      </div>
    ));
  }

  return (
    <Container>
      {/* Edit order modal */}
      <Dialog open={currentOrder !== -1} onClose={cleanCurrentOrder}>
        <DialogTitle>
          {t('orders:order-id')} - {currentOrder}
        </DialogTitle>
        <DialogContent>
          {state?.currentOrderLoadingStatus === 'loaded' ? (
            <div>
              <Typography variant={'h6'}>Status</Typography>
              <Select
                value={currentOrderStatus}
                onChange={(e) =>
                  setCurrentOrderStatus(e.target.value as number)
                }
              >
                <MenuItem value={0}>
                  {t('orders:order-status.status', { context: '0' })}
                </MenuItem>
                <MenuItem value={1}>
                  {t('orders:order-status.status', { context: '1' })}
                </MenuItem>
                <MenuItem value={2}>
                  {t('orders:order-status.status', { context: '2' })}
                </MenuItem>
              </Select>
              <Typography variant={'h6'}>{t('admin:products')}</Typography>
              {renderProducts()}
              <Typography variant={'h6'}>
                {t('orders:total-price')}: {state.currentOrder?.totalPrice}
              </Typography>
            </div>
          ) : state?.currentOrderLoadingStatus === 'loading' ? (
            <div>{t('admin:loading')}</div>
          ) : (
            <div>{t('admin:error')}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanCurrentOrder}>{t('admin:cancel')}</Button>
          <Button
            onClick={editStatusHandler}
            disabled={state?.currentOrderLoadingStatus !== 'loaded'}
          >
            {t('admin:apply')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Component */}
      <Typography variant={'h5'}>{t('admin:orders.orders')}</Typography>
      <div className={classes.header}>
        {/* Header */}
        <Card className={classes.feed}>
          <CardContent>
            {/* Feed */}
            <Typography variant={'h6'}>{t('admin:feed')}</Typography>
            {(props.feed || []).map((item) => (
              <div key={item.status}>
                {t('orders:order-status.status', { context: '' + item.status })}{' '}
                - {item.count}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className={classes.chart}>
          <CardContent>
            <Typography variant={'h6'}>
              {t('admin:orders.last-year-chart')}
            </Typography>
            <ResponsiveContainer
              height={150}
              minWidth={300}
              className={classes.chartResp}
            >
              <LineChart data={props?.chartData}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <div>
        <Card>
          <CardContent className={classes.ordersHeader}>
            <span>{t('orders:order-id')}</span>
            <span>{t('orders:order-status.status')}</span>
            <span>{t('orders:order-date')}</span>
            <span></span>
          </CardContent>
        </Card>
        <div>{renderOrders()}</div>
      </div>
      <Pagination
        next={() => pagination(true)}
        prev={() => pagination(false)}
        currentPage={+props.page}
        hasMore={props.hasMore}
      />
    </Container>
  );
}

/**
 * Ssr props
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = checkUser(context.req);
  if (
    typeof userData?.user?.id === 'undefined' ||
    !userData?.user?.admin?.isAdmin
  )
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore();
  const pageSize = +(context.query.pageSize || 5);
  const page = +(context.query.page || 1);

  const orders = await orderModel.getAllOrders(+pageSize, +page);
  const ordersData = orders.map((item) => {
    return {
      ...item,
      created_on: new Date(item.created_on).toString(),
    };
  });
  const hasMore = ordersData.length > +pageSize;
  if (hasMore) {
    ordersData.splice(ordersData.length - 1, 1);
  }
  await reduxStore.dispatch(getOrders(ordersData));

  const feed = await orderModel.getFeed();
  feed.splice(0, 1);
  const feedData = (feed || []).map((item) => ({
    status: item.status || 0,
    count: item.count || 0,
  }));
  await reduxStore.dispatch(getFeed(feedData));

  const ordersByMonth = await orderModel.getOrdersByMonth();
  const chartData = ordersByMonth.map((item, index: number) => ({
    name: moment(new Date(item.date_trunc).toString()).format('MMMM'),
    uv: item.count,
    pv: index,
  }));
  await reduxStore.dispatch(getChartData(chartData));

  return {
    props: {
      feed: reduxStore.getState().orders.feed,
      chartData: reduxStore.getState().orders.chartData,
      orders: reduxStore.getState().orders.orders,
      hasMore,
      page: page || 1,
    },
  };
};
