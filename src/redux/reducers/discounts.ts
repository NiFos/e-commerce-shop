import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IDiscountModel } from '../../models/discount';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const discountsReducerTypes = {
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
export interface IDiscountsReducer {
  discounts?: IDiscountModel[];
  newDiscount?: {
    id?: number;
    photo?: string;
  };
  createLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  uploadPhotoLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IDiscountsReducer = {};

/**
 * Discounts reducer
 */
export const discountsReducer = (
  state = initialState,
  { type, payload }: DiscountsAction
): IDiscountsReducer => {
  switch (type) {
    case discountsReducerTypes.getDiscounts: {
      return {
        ...state,
        discounts: payload as IDiscountModel[],
      };
    }

    case discountsReducerTypes.createDiscount: {
      return {
        ...state,
        newDiscount: {
          id: +payload,
        },
      };
    }

    case discountsReducerTypes.uploadPhoto: {
      return {
        ...state,
        newDiscount: {
          photo: payload as string,
        },
      };
    }

    case discountsReducerTypes.uploadPhotoLoadingStatus: {
      return {
        ...state,
        uploadPhotoLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case discountsReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case discountsReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case discountsReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions

interface IDiscountData extends IDiscountModel {
  photo: string;
}
interface GetDiscounts {
  type: typeof discountsReducerTypes.getDiscounts;
  payload: IDiscountData[];
}
/**
 * Get discounts action
 */
export const getDiscounts = (discounts: IDiscountData[]): GetDiscounts => {
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
): ThunkAction<void, RootState, unknown, DiscountsAction> => async (
  dispatch
) => {
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
export const deleteDiscount = (
  id: number
): ThunkAction<void, RootState, unknown, DiscountsAction> => async (
  dispatch
) => {
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
): ThunkAction<void, RootState, unknown, DiscountsAction> => async (
  dispatch
) => {
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

interface UploadDiscountPhotoAction {
  type: typeof discountsReducerTypes.uploadPhoto;
  payload: string;
}

/**
 * Upload photo to discount
 * @param id - Discount id
 * @param file - Image
 * @param mod - If you replace image on product
 */
export const uploadDiscountPhoto = (
  id: number,
  file: File,
  mod: boolean
): ThunkAction<void, RootState, unknown, DiscountsAction> => async (
  dispatch
) => {
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

export type DiscountsAction = UploadDiscountPhotoAction | GetDiscounts;
