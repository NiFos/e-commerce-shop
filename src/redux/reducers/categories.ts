import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import {
  IPublicCategory,
  ICategory,
  ISubcategory,
} from '../../pages/api/category/getAll';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const categoriesReducerTypes = {
  getCategories: 'categories/GET_CATEGORIES',
  getPublicCategories: 'categories/GET_PUBLIC_CATEGORIES',
  getSubcategories: 'categories/GET_SUBCATEGORIES',
  getPublicCategoriesLoadingStatus:
    'categories/GET_PUBLIC_CATEGORIES_LOADING_STATUS',
  getSubcategoriesLoadingStatus: 'categories/GET_SUBCATEGORIES_LOADING_STATUS',
  createLoadingStatus: 'categories/CREATE_LOADING_STATUS',
  editLoadingStatus: 'categories/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'categories/DELETE_LOADING_STATUS',
};
export interface ICategoriesReducer {
  categories?: ICategory[];
  publicCategories?: IPublicCategory[];
  subCategories?: ISubcategory[];
  getPublicCategoriesLoadingStatus?: 'loading' | 'error' | 'loaded';
  getSubcategoriesLoadingStatus?: 'loading' | 'error' | 'loaded';
  createLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: ICategoriesReducer = {};

/**
 * Categories reducer
 */
export const categoriesReducer = (
  state = initialState,
  { type, payload }: CategoriesAction
): ICategoriesReducer => {
  switch (type) {
    case categoriesReducerTypes.getCategories: {
      return {
        ...state,
        categories: payload as ICategory[],
      };
    }

    case categoriesReducerTypes.getSubcategories: {
      return {
        ...state,
        subCategories: payload as ISubcategory[],
      };
    }

    case categoriesReducerTypes.getPublicCategories: {
      return {
        ...state,
        publicCategories: payload as IPublicCategory[],
      };
    }

    case categoriesReducerTypes.getPublicCategoriesLoadingStatus: {
      return {
        ...state,
        getPublicCategoriesLoadingStatus: payload as
          | 'loading'
          | 'loaded'
          | 'error',
      };
    }

    case categoriesReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case categoriesReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case categoriesReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case categoriesReducerTypes.getSubcategoriesLoadingStatus: {
      return {
        ...state,
        getSubcategoriesLoadingStatus: payload as
          | 'loading'
          | 'loaded'
          | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface GetCategoriesAction {
  type: typeof categoriesReducerTypes.getCategories;
  payload: ICategory[];
}

/**
 * Get categories action
 */
export const getCategories = (categories: ICategory[]): GetCategoriesAction => {
  return {
    type: categoriesReducerTypes.getCategories,
    payload: categories,
  };
};

interface GetPublicSubcategoriesAction {
  type: typeof categoriesReducerTypes.getPublicCategories;
  payload: IPublicCategory[];
}
interface GetPublicCategoriesLoadingStatusAction {
  type: typeof categoriesReducerTypes.getPublicCategoriesLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Get categories action
 */
export const getPublicCategories = (): ThunkAction<
  void,
  RootState,
  unknown,
  CategoriesAction
> => async (dispatch) => {
  try {
    dispatch({
      type: categoriesReducerTypes.getPublicCategoriesLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get('/api/category/getAll');
    dispatch({
      type: categoriesReducerTypes.getPublicCategories,
      payload: response.data.categories,
    });
    dispatch({
      type: categoriesReducerTypes.getPublicCategoriesLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoriesReducerTypes.getPublicCategoriesLoadingStatus,
      payload: 'error',
    });
  }
};

interface GetSubcategoriesAction {
  type: typeof categoriesReducerTypes.getSubcategories;
  payload: ISubcategory[];
}

/**
 * Get categories action
 */
export const getSubcategories = (
  categoryId: number
): ThunkAction<void, RootState, unknown, CategoriesAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.getSubcategoriesLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get(
      `/api/admin/subcategories?categoryId=${categoryId}`
    );
    dispatch({
      type: categoriesReducerTypes.getSubcategories,
      payload: response.data.subcategories,
    });
    dispatch({
      type: categoriesReducerTypes.getSubcategoriesLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoriesReducerTypes.getSubcategoriesLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Edit category action
 */
export const editCategory = (
  isCategory: boolean,
  id: number,
  title: string
): ThunkAction<void, RootState, unknown, CategoriesAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post(
      `/api/admin/${isCategory ? 'categories' : 'subcategories'}/edit?id=${id}`,
      { id, title }
    );
    dispatch({
      type: categoriesReducerTypes.editLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoriesReducerTypes.editLoadingStatus,
      payload: 'error',
    });
  }
};
/**
 * Delete category action
 */
export const deleteCategory = (
  isCategory: boolean,
  id: number
): ThunkAction<void, RootState, unknown, CategoriesAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.deleteLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.delete(
      `/api/admin/${
        isCategory ? 'categories' : 'subcategories'
      }/delete?id=${id}`
    );
    dispatch({
      type: categoriesReducerTypes.deleteLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoriesReducerTypes.deleteLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Create category action
 */
export const createCategory = (
  isCategory: boolean,
  title: string,
  categoryId?: number
): ThunkAction<void, RootState, unknown, CategoriesAction> => async (
  dispatch
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.createLoadingStatus,
      payload: 'loading',
    });
    const options = isCategory ? { title } : { categoryId, title };
    await axiosInstance.post(
      `/api/admin/${isCategory ? 'categories' : 'subcategories'}/create`,
      options
    );
    dispatch({
      type: categoriesReducerTypes.createLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: categoriesReducerTypes.createLoadingStatus,
      payload: 'error',
    });
  }
};

export type CategoriesAction =
  | GetSubcategoriesAction
  | GetPublicSubcategoriesAction
  | GetCategoriesAction
  | GetPublicCategoriesLoadingStatusAction;
