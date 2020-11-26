import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const categoryReducerTypes = {
  getProducts: 'category/GET_CATEGORY',
  getProductsLoadingStatus: 'category/GET_PRODUCTS_LOADING_STATUS',
};
export interface ICategoryReducer {
  products?: any[];
  getProductsLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: ICategoryReducer = {};

/**
 * Category reducer
 */
export const categoryReducer = (
  state = initialState,
  { type, payload }: CategoryAction
): ICategoryReducer => {
  switch (type) {
    case categoryReducerTypes.getProducts: {
      return {
        ...state,
        products: payload as any[],
      };
    }

    case categoryReducerTypes.getProductsLoadingStatus: {
      return {
        ...state,
        getProductsLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface GetProductsInCategory {
  type: typeof categoryReducerTypes.getProducts;
  payload: any[];
}

interface GetProductsLoadingStatusAction {
  type: typeof categoryReducerTypes.getProductsLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Get products in category
 * @param id - Discount id
 */
export const getProductsInCategory = (
  subcategoryId: number,
  prices: [number, number],
  pageSize: number,
  after: number
): ThunkAction<void, RootState, unknown, CategoryAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: categoryReducerTypes.getProductsLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post('/api/category', {
      subcategoryId,
      tags: [],
      prices,
      pageSize,
      after,
    });

    dispatch({
      type: categoryReducerTypes.getProducts,
      payload: response.data.products,
    });
    dispatch({
      type: categoryReducerTypes.getProductsLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoryReducerTypes.getProductsLoadingStatus,
      payload: error,
    });
  }
};

export type CategoryAction =
  | GetProductsInCategory
  | GetProductsLoadingStatusAction;
