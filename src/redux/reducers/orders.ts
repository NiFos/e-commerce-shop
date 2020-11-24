import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const ordersReducerTypes = {
  getOrders: 'orders/GET_ORDERS',
  getFeed: 'orders/GET_FEED',
  getChartData: 'orders/GET_CHART_DATA',
  getOrder: 'orders/GET_ORDER',
  getOrderLoadingStatus: 'orders/GET_ORDER_LOADING_STATUS',
  editOrderStatus: 'orders/EDIT_STATUS',
};
export interface IOrdersReducer {
  orders?: any;
  currentOrder?: any;
  currentOrderLoadingStatus?: 'loading' | 'error' | 'loaded';
  feed?: any;
  chartData?: any;
}
const initialState: IOrdersReducer = {};

/**
 * Orders reducer
 */
export const ordersReducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case ordersReducerTypes.getOrders: {
      return {
        ...state,
        orders: payload,
      };
    }

    case ordersReducerTypes.getFeed: {
      return {
        ...state,
        feed: payload,
      };
    }

    case ordersReducerTypes.getChartData: {
      return {
        ...state,
        chartData: payload,
      };
    }

    case ordersReducerTypes.getOrder: {
      return {
        ...state,
        currentOrder: payload,
      };
    }

    case ordersReducerTypes.getOrderLoadingStatus: {
      return {
        ...state,
        currentOrderLoadingStatus: payload,
      };
    }

    case ordersReducerTypes.editOrderStatus: {
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          status: payload,
        },
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Get orders action
 */
export const getOrders = (orders: any[]) => {
  return {
    type: ordersReducerTypes.getOrders,
    payload: orders,
  };
};

/**
 * Get orders action
 */
export const getFeed = (feedItems: any[]) => {
  return {
    type: ordersReducerTypes.getFeed,
    payload: feedItems,
  };
};

/**
 * Get orders action
 */
export const getChartData = (chartData: any[]) => {
  return {
    type: ordersReducerTypes.getChartData,
    payload: chartData,
  };
};

/**
 * Get order information
 * @param orderId - Order id
 */
export const getOrder = (orderId: number) => async (dispatch: any) => {
  try {
    dispatch({
      type: ordersReducerTypes.getOrderLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get(
      `/api/admin/orders/get?orderId=${orderId}`
    );
    dispatch({
      type: ordersReducerTypes.getOrder,
      payload: response.data,
    });
    dispatch({
      type: ordersReducerTypes.getOrderLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: ordersReducerTypes.getOrderLoadingStatus,
      payload: 'error',
    });
    dispatch({
      type: ordersReducerTypes.getOrder,
      payload: {},
    });
  }
};

/**
 * Edit order status
 * @param status - Status number
 */
export const editOrderStatus = (orderId: number, status: number) => async (
  dispatch: any
) => {
  try {
    await axiosInstance.post('api/admin/orders/edit', {
      orderId,
      status,
    });
    dispatch({
      type: ordersReducerTypes.editOrderStatus,
      payload: status,
    });
  } catch (error) {
    console.log(error);
  }
};
