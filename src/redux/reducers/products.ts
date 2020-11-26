import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const productsReducerTypes = {
  getProducts: 'products/GET_products',
  createProduct: 'products/CREATE_PRODUCT',
  uploadPhoto: 'products/UPLOAD_PHOTO',
  search: 'products/SEARCH',
  uploadPhotoLoadingStatus: 'products/UPLOAD_PHOTO_LOADING_STATUS',
  createLoadingStatus: 'products/ADD_LOADING_STATUS',
  editLoadingStatus: 'products/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'products/DELETE_LOADING_STATUS',
  getProductsLoadingStatus: 'products/SEARCH_LOADING_STATUS',
  addReviewLoadingStatus: 'products/ADD_REVIEW_LOADING_STATUS',
};
export interface IProductsReducer {
  products?: any[];
  newProduct?: {
    id?: number;
    photo?: string;
  };
  search?: any[];
  createLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  uploadPhotoLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
  getProductsLoadingStatus?: 'loading' | 'error' | 'loaded';
  addReviewLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IProductsReducer = {};

/**
 * Products reducer
 */
export const productsReducer = (
  state = initialState,
  { type, payload }: ProductsAction
): IProductsReducer => {
  switch (type) {
    case productsReducerTypes.getProducts: {
      return {
        ...state,
        products: payload as any[],
      };
    }

    case productsReducerTypes.createProduct: {
      return {
        ...state,
        newProduct: {
          id: +payload,
        },
      };
    }

    case productsReducerTypes.uploadPhoto: {
      return {
        ...state,
        newProduct: {
          photo: payload.toString(),
        },
      };
    }

    case productsReducerTypes.search: {
      return {
        ...state,
        search: payload as any[],
      };
    }

    case productsReducerTypes.uploadPhotoLoadingStatus: {
      return {
        ...state,
        uploadPhotoLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case productsReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case productsReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case productsReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case productsReducerTypes.getProductsLoadingStatus: {
      return {
        ...state,
        getProductsLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case productsReducerTypes.addReviewLoadingStatus: {
      return {
        ...state,
        addReviewLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface GetProducts {
  type: typeof productsReducerTypes.getProducts;
  payload: any[];
}

/**
 * Get products action
 */
export const getProducts = (products: any[]): GetProducts => {
  return {
    type: productsReducerTypes.getProducts,
    payload: products,
  };
};

/**
 * Edit product action
 * @param productId - product id
 * @param title - product title
 * @param description - product description
 */
export const editProduct = (
  data: any
): ThunkAction<void, RootState, unknown, ProductsAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: productsReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/admin/products/edit', data);
    dispatch({
      type: productsReducerTypes.editLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: productsReducerTypes.editLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Delete product action
 * @param id - product id
 */
export const deleteProduct = (
  id: number
): ThunkAction<void, RootState, unknown, ProductsAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: productsReducerTypes.deleteLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.delete(`/api/admin/products/delete?productId=${id}`);
    dispatch({
      type: productsReducerTypes.deleteLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: productsReducerTypes.deleteLoadingStatus,
      payload: 'error',
    });
  }
};

interface CreateProductAction {
  type: typeof productsReducerTypes.createProduct;
  payload: number;
}

/**
 * Create product action
 * @param title - product title
 * @param description - product description
 * @param techspecs - product tech specs
 * @param price - product price
 * @param quantity - product quantity
 * @param subcategoryId - product subcategory
 */
export const createProduct = (
  title: string,
  description: string,
  techspecs: string,
  price: number,
  quantity: number,
  subcategoryId: number
): ThunkAction<void, RootState, unknown, ProductsAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: productsReducerTypes.createLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post('/api/admin/products/create', {
      title,
      description,
      techspecs,
      price,
      quantity,
      subcategoryid: subcategoryId,
    });
    dispatch({
      type: productsReducerTypes.createLoadingStatus,
      payload: 'loaded',
    });
    dispatch({
      type: productsReducerTypes.createProduct,
      payload: response.data.product.product_id,
    });
  } catch (error) {
    dispatch({
      type: productsReducerTypes.createLoadingStatus,
      payload: 'error',
    });
  }
};

interface UploadProductPhotoAction {
  type: typeof productsReducerTypes.uploadPhoto;
  payload: string;
}

/**
 * Upload photo to product
 * @param id - product id
 * @param file - Image
 * @param mod - If you replace image on product
 */
export const uploadProductPhoto = (
  id: number,
  file: any,
  mod: boolean
): ThunkAction<void, RootState, unknown, ProductsAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: productsReducerTypes.uploadPhotoLoadingStatus,
      payload: 'loading',
    });
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/api/admin/products/uploadPhoto?productId=${id}&mod=${mod}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    dispatch({
      type: productsReducerTypes.uploadPhoto,
      payload: response.data.photo,
    });
    dispatch({
      type: productsReducerTypes.uploadPhotoLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: productsReducerTypes.uploadPhotoLoadingStatus,
      payload: error,
    });
  }
};

/**
 * Send review
 */
export const sendReview = (
  rating: number,
  text: string,
  productId: number
): ThunkAction<void, RootState, unknown, ProductsAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: productsReducerTypes.addReviewLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/product/sendreview', {
      productId,
      text,
      rating,
    });
    dispatch({
      type: productsReducerTypes.addReviewLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: productsReducerTypes.addReviewLoadingStatus,
      payload: error,
    });
  }
};

export type ProductsAction =
  | UploadProductPhotoAction
  | GetProducts
  | UploadProductPhotoAction
  | CreateProductAction;
