import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const searchReducerTypes = {
  searchProducts: 'search/SEARCH_PRODUCTS',
  searchProductsLoadingStatus: 'search/SEARCH_PRODUCTS_LOADING_STATUS',
};
export interface ISearchReducer {
  products?: any[];
  searchProductsLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: ISearchReducer = {};

/**
 * Search reducer
 */
export const searchReducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case searchReducerTypes.searchProducts: {
      return {
        ...state,
        products: payload,
      };
    }

    case searchReducerTypes.searchProductsLoadingStatus: {
      return {
        ...state,
        searchProductsLoadingStatus: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Get products in search
 * @param search - Search value
 */
export const searchProducts = (search: string) => async (dispatch: any) => {
  try {
    dispatch({
      type: searchReducerTypes.searchProductsLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post(`/api/search?search=${search}`);

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
