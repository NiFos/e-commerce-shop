/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IFeed, IOrderModel, IUserOrderModel } from '../../models/order';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const ordersReducerTypes = {
  getOrders: 'orders/GET_ORDERS',
  getFeed: 'orders/GET_FEED',
  getChartData: 'orders/GET_CHART_DATA',
  getOrder: 'orders/GET_ORDER',
  getOrderLoadingStatus: 'orders/GET_ORDER_LOADING_STATUS',
  editOrderStatus: 'orders/EDIT_STATUS',
};
export interface IOrdersReducer {
  orders?: IOrderModel[];
  currentOrder?: IUserOrderModel;
  currentOrderLoadingStatus?: 'loading' | 'error' | 'loaded';
  feed?: IFeed[];
  chartData?: IChartData[];
}
interface IChartData {
  name: string;
  uv: number;
  pv: number;
}

const initialState: IOrdersReducer = {};

/**
 * Orders reducer
 */
export const ordersReducer = (
  state = initialState,
  { type, payload }: OrdersAction
): IOrdersReducer => {
  switch (type) {
    case ordersReducerTypes.getOrders: {
      return {
        ...state,
        orders: payload as IOrderModel[],
      };
    }

    case ordersReducerTypes.getFeed: {
      return {
        ...state,
        feed: payload as IFeed[],
      };
    }

    case ordersReducerTypes.getChartData: {
      return {
        ...state,
        chartData: payload as IChartData[],
      };
    }

    case ordersReducerTypes.getOrder: {
      return {
        ...state,
        currentOrder: payload as IUserOrderModel,
      };
    }

    case ordersReducerTypes.getOrderLoadingStatus: {
      return {
        ...state,
        currentOrderLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case ordersReducerTypes.editOrderStatus: {
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          status: +payload,
        } as any,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions

interface GetOrdersAction {
  type: typeof ordersReducerTypes.getOrders;
  payload: IOrderModel[];
}
/**
 * Get orders action
 */
export const getOrders = (orders: IOrderModel[]): GetOrdersAction => {
  return {
    type: ordersReducerTypes.getOrders,
    payload: orders,
  };
};

interface GetFeedAction {
  type: typeof ordersReducerTypes.getFeed;
  payload: IFeed[];
}

/**
 * Get orders action
 */
export const getFeed = (feedItems: IFeed[]): GetFeedAction => {
  return {
    type: ordersReducerTypes.getFeed,
    payload: feedItems,
  };
};

interface GetChartAction {
  type: typeof ordersReducerTypes.getChartData;
  payload: IChartData[];
}

/**
 * Get orders action
 */
export const getChartData = (chartData: IChartData[]): GetChartAction => {
  return {
    type: ordersReducerTypes.getChartData,
    payload: chartData,
  };
};

interface GetOrderAction {
  type: typeof ordersReducerTypes.getOrder;
  payload: IUserOrderModel;
}

interface GetOrderLoadingStatus {
  type: typeof ordersReducerTypes.getOrderLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Get order information
 * @param orderId - Order id
 */
export const getOrder = (
  orderId: number
): ThunkAction<void, RootState, unknown, OrdersAction> => async (dispatch) => {
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
      payload: response.data.discount,
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
  }
};

interface EditOrderStatusAction {
  type: typeof ordersReducerTypes.editOrderStatus;
  payload: number;
}

/**
 * Edit order status
 * @param status - Status number
 */
export const editOrderStatus = (
  orderId: number,
  status: number
): ThunkAction<void, RootState, unknown, OrdersAction> => async (dispatch) => {
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

export type OrdersAction =
  | EditOrderStatusAction
  | GetOrderAction
  | GetChartAction
  | GetFeedAction
  | GetOrdersAction
  | GetOrderLoadingStatus;
