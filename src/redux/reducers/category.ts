import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const categoryReducerTypes = {
  getProducts: 'category/GET_CATEGORY',
  getProductsLoadingStatus: 'category/GET_PRODUCTS_LOADING_STATUS',
};
export interface IcategoryReducer {
  products?: any[];
  getProductsLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IcategoryReducer = {};

/**
 * Category reducer
 */
export const categoryReducer = (
  state = initialState,
  { type, payload }: any
) => {
  switch (type) {
    case categoryReducerTypes.getProducts: {
      return {
        ...state,
        products: payload,
      };
    }

    case categoryReducerTypes.getProductsLoadingStatus: {
      return {
        ...state,
        getProductsLoadingStatus: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Get products in category
 * @param id - Discount id
 */
export const getProductsInCategory = (
  subcategoryId: number,
  prices: [number, number],
  pageSize: number,
  after: number
) => async (dispatch: any) => {
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
