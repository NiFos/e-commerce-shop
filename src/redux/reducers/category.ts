import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IProductModel } from '../../models/product';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const categoryReducerTypes = {
  getProducts: 'category/GET_CATEGORY',
  getProductsLoadingStatus: 'category/GET_PRODUCTS_LOADING_STATUS',
};

interface ICategoryData {
  products?: IProductModel[];
  hasMore?: boolean;
  page?: number;
}
export interface ICategoryReducer {
  category?: ICategoryData;
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
        category: {
          ...state.category,
          ...(payload as ICategoryData),
        },
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
  payload: {
    products: IProductModel[];
    hasMore: boolean;
    page: number;
  };
}

interface GetProductsLoadingStatusAction {
  type: typeof categoryReducerTypes.getProductsLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Get products in category
 * @param subcategoryId - Subcategory id
 * @param prices - prices [min, max]
 * @param tags - tags ids [0, 1, ...]
 * @param pageSize - page size
 * @param page - page
 */
export const getProductsInCategory = (
  subcategoryId: number,
  prices: [number, number],
  tags: number[],
  pageSize: number,
  page: number
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
      tags,
      prices,
      pageSize,
      page,
    });

    dispatch({
      type: categoryReducerTypes.getProducts,
      payload: response.data,
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
