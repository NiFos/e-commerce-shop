import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IProductModel } from '../../models/product';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const searchReducerTypes = {
  searchProducts: 'search/SEARCH_PRODUCTS',
  searchProductsLoadingStatus: 'search/SEARCH_PRODUCTS_LOADING_STATUS',
};
export interface ISearchReducer {
  products?: IProductModel[];
  searchProductsLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: ISearchReducer = {};

/**
 * Search reducer
 */
export const searchReducer = (
  state = initialState,
  { type, payload }: SearchAction
): ISearchReducer => {
  switch (type) {
    case searchReducerTypes.searchProducts: {
      return {
        ...state,
        products: payload as IProductModel[],
      };
    }

    case searchReducerTypes.searchProductsLoadingStatus: {
      return {
        ...state,
        searchProductsLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface SearchProductsAction {
  type: typeof searchReducerTypes.searchProducts;
  payload: IProductModel[];
}

interface SearchProductsLoadingStatusAction {
  type: typeof searchReducerTypes.searchProductsLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Get products in search
 * @param search - Search value
 */
export const searchProducts = (
  search: string
): ThunkAction<void, RootState, unknown, SearchAction> => async (dispatch) => {
  try {
    dispatch({
      type: searchReducerTypes.searchProductsLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get(`/api/search?search=${search}`);

    dispatch({
      type: searchReducerTypes.searchProducts,
      payload: response.data.products,
    });
    dispatch({
      type: searchReducerTypes.searchProductsLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: searchReducerTypes.searchProductsLoadingStatus,
      payload: error,
    });
  }
};

export type SearchAction =
  | SearchProductsAction
  | SearchProductsLoadingStatusAction;
