import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const discountsReducerTypes = {
  getDiscounts: 'discounts/GET_DISCOUNTS',
  createDiscount: 'discounts/CREATE_DISCOUNT',
  uploadPhoto: 'discounts/UPLOAD_PHOTO',
  search: 'discounts/SEARCH',
  uploadPhotoLoadingStatus: 'discounts/UPLOAD_PHOTO_LOADING_STATUS',
  createLoadingStatus: 'discounts/ADD_LOADING_STATUS',
  editLoadingStatus: 'discounts/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'discounts/DELETE_LOADING_STATUS',
  searchLoadingStatus: 'discounts/SEARCH_LOADING_STATUS',
};
export interface IdiscountsReducer {
  discounts?: any[];
  newDiscount?: {
    id?: number;
    photo?: string;
  };
  search?: any[];
  createLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  uploadPhotoLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
  searchLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IdiscountsReducer = {};

/**
 * Discounts reducer
 */
export const discountsReducer = (
  state = initialState,
  { type, payload }: any
) => {
  switch (type) {
    case discountsReducerTypes.getDiscounts: {
      return {
        ...state,
        discounts: payload,
      };
    }

    case discountsReducerTypes.createDiscount: {
      return {
        ...state,
        newDiscount: {
          id: payload,
        },
      };
    }

    case discountsReducerTypes.uploadPhoto: {
      return {
        ...state,
        newDiscount: {
          photo: payload,
        },
      };
    }

    case discountsReducerTypes.search: {
      return {
        ...state,
        search: payload,
      };
    }

    case discountsReducerTypes.uploadPhotoLoadingStatus: {
      return {
        ...state,
        uploadPhotoLoadingStatus: payload,
      };
    }

    case discountsReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload,
      };
    }

    case discountsReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload,
      };
    }

    case discountsReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload,
      };
    }

    case discountsReducerTypes.searchLoadingStatus: {
      return {
        ...state,
        searchLoadingStatus: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Get discounts action
 */
export const getDiscounts = (discounts: any[]) => {
  return {
    type: discountsReducerTypes.getDiscounts,
    payload: discounts,
  };
};

/**
 * Edit discount action
 * @param discountId - Discount id
 * @param title - Discount title
 * @param description - Discount description
 */
export const editDiscount = (
  discountId: number,
  title?: string,
  description?: string
) => async (dispatch: any) => {
  try {
    const data: { discountId: number; title?: string; description?: string } = {
      discountId,
    };
    if (typeof title !== 'undefined') data.title = title;
    if (typeof description !== 'undefined') data.description = description;
    dispatch({
      type: discountsReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/admin/discounts/edit', data);
    dispatch({
      type: discountsReducerTypes.editLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: discountsReducerTypes.editLoadingStatus,
      payload: 'error',
    });
  }
};
/**
 * Delete discount action
 * @param id - Discount id
 */
export const deleteDiscount = (id: number) => async (dispatch: any) => {
  try {
    dispatch({
      type: discountsReducerTypes.deleteLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.delete(`/api/admin/discounts/delete?discountId=${id}`);
    dispatch({
      type: discountsReducerTypes.deleteLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: discountsReducerTypes.deleteLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Create discount action
 * @param title - Discount title
 * @param description - Discount description
 * @param to - Discount due to (timestamp)
 * @param percentage - Discount percentage
 * @param promocode - Discount promocode
 */
export const createDiscount = (
  title: string,
  description: string,
  to: string,
  percentage: number,
  promocode: string
) => async (dispatch: any) => {
  try {
    dispatch({
      type: discountsReducerTypes.createLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post('/api/admin/discounts/create', {
      title,
      description,
      to: Date.parse(to),
      percentage,
      promocode: promocode.toUpperCase(),
    });
    dispatch({
      type: discountsReducerTypes.createLoadingStatus,
      payload: 'loaded',
    });
    dispatch({
      type: discountsReducerTypes.createDiscount,
      payload: response.data.discount.discount_id,
    });
  } catch (error) {
    dispatch({
      type: discountsReducerTypes.createLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Upload photo to discount
 * @param id - Discount id
 * @param file - Image
 * @param mod - If you replace image on product
 */
export const uploadDiscountPhoto = (
  id: number,
  file: any,
  mod: boolean
) => async (dispatch: any) => {
  try {
    dispatch({
      type: discountsReducerTypes.uploadPhotoLoadingStatus,
      payload: 'loading',
    });
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/api/admin/discounts/uploadPhoto?discountId=${id}&mod=${mod}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    dispatch({
      type: discountsReducerTypes.uploadPhoto,
      payload: response.data.photo,
    });
    dispatch({
      type: discountsReducerTypes.uploadPhotoLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: discountsReducerTypes.uploadPhotoLoadingStatus,
      payload: error,
    });
  }
};
