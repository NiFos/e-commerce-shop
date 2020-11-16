import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const categoriesReducerTypes = {
  getCategories: 'categories/GET_CATEGORIES',
  getPublicCategories: 'categories/GET_PUBLIC_CATEGORIES',
  getSubcategories: 'categories/GET_SUBCATEGORIES',
  getPublicCategoriesLoadingStatus:
    'categories/GET_SUBCATEGORIES_LOADING_STATUS',
  getSubcategoriesLoadingStatus: 'categories/GET_SUBCATEGORIES_LOADING_STATUS',
  createLoadingStatus: 'categories/CREATE_LOADING_STATUS',
  editLoadingStatus: 'categories/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'categories/DELETE_LOADING_STATUS',
};
export interface ICategoriesReducer {
  categories?: any[];
  publicCategories?: any[];
  subCategories?: any[];
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
  { type, payload }: any
) => {
  switch (type) {
    case categoriesReducerTypes.getCategories: {
      return {
        ...state,
        categories: payload,
      };
    }

    case categoriesReducerTypes.getSubcategories: {
      return {
        ...state,
        subCategories: payload,
      };
    }

    case categoriesReducerTypes.getPublicCategories: {
      return {
        ...state,
        publicCategories: payload,
      };
    }

    case categoriesReducerTypes.getPublicCategoriesLoadingStatus: {
      return {
        ...state,
        getPublicCategoriesLoadingStatus: payload,
      };
    }

    case categoriesReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload,
      };
    }

    case categoriesReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload,
      };
    }

    case categoriesReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload,
      };
    }

    case categoriesReducerTypes.getSubcategoriesLoadingStatus: {
      return {
        ...state,
        getSubcategoriesLoadingStatus: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Get categories action
 */
export const getCategories = (categories: any[]) => {
  return {
    type: categoriesReducerTypes.getCategories,
    payload: categories,
  };
};

/**
 * Get categories action
 */
export const getPublicCategories = () => async (dispatch: any) => {
  try {
    dispatch({
      type: categoriesReducerTypes.getPublicCategoriesLoadingStatus,
      payload: 'loading',
    });
    const response = await Axios.get('/api/category/getAll');
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

/**
 * Get categories action
 */
export const getSubcategories = (categoryId: number) => async (
  dispatch: any
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.getSubcategoriesLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get(
      `/api/admin/subcategories/?categoryid=${categoryId}`
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
) => async (dispatch: any) => {
  try {
    dispatch({
      type: categoriesReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post(
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
export const deleteCategory = (isCategory: boolean, id: number) => async (
  dispatch: any
) => {
  try {
    dispatch({
      type: categoriesReducerTypes.deleteLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.delete(
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
) => async (dispatch: any) => {
  try {
    dispatch({
      type: categoriesReducerTypes.createLoadingStatus,
      payload: 'loading',
    });
    const options = isCategory ? { title } : { categoryid: categoryId, title };
    const response = await axiosInstance.post(
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
