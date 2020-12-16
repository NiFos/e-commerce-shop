import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IAdmin } from '../../models/admin';
import { IUserModel } from '../../models/user';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const adminsReducerTypes = {
  getAdmins: 'admins/GET_ADMINS',
  search: 'admins/SEARCH',
  addLoadingStatus: 'admins/ADD_LOADING_STATUS',
  editLoadingStatus: 'admins/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'admins/DELETE_LOADING_STATUS',
  searchLoadingStatus: 'admins/SEARCH_LOADING_STATUS',
};
export interface IAdminsReducer {
  admins?: IAdmin[];
  search?: IUserModel[];
  addLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
  searchLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IAdminsReducer = {};

/**
 * Admins reducer
 */
export const adminsReducer = (
  state = initialState,
  { type, payload }: AdminsAction
): IAdminsReducer => {
  switch (type) {
    case adminsReducerTypes.getAdmins: {
      return {
        ...state,
        admins: payload as IAdmin[],
      };
    }

    case adminsReducerTypes.search: {
      return {
        ...state,
        search: payload as IUserModel[],
      };
    }

    case adminsReducerTypes.addLoadingStatus: {
      return {
        ...state,
        addLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case adminsReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case adminsReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case adminsReducerTypes.searchLoadingStatus: {
      return {
        ...state,
        searchLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface GetAdminsAction {
  type: typeof adminsReducerTypes.getAdmins;
  payload: IAdmin[];
}

/**
 * Get admins action
 */
export const getAdmins = (admins: IAdmin[]): GetAdminsAction => {
  return {
    type: adminsReducerTypes.getAdmins,
    payload: admins,
  };
};

/**
 * Edit admin action
 * @param id - User id
 * @param fullAccess - Only view access or full access
 */
export const editAdmin = (
  id: number,
  fullAccess: boolean
): ThunkAction<void, RootState, unknown, AdminsAction> => async (dispatch) => {
  try {
    dispatch({
      type: adminsReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/admin/user/editadmin', {
      userId: id,
      fullAccess,
    });
    dispatch({
      type: adminsReducerTypes.editLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: adminsReducerTypes.editLoadingStatus,
      payload: 'error',
    });
  }
};
/**
 * Delete admin action
 */
export const deleteAdmin = (
  id: number
): ThunkAction<void, RootState, unknown, AdminsAction> => async (dispatch) => {
  try {
    dispatch({
      type: adminsReducerTypes.deleteLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.delete(`/api/admin/user/deleteadmin?userId=${id}`);
    dispatch({
      type: adminsReducerTypes.deleteLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: adminsReducerTypes.deleteLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Add admin action
 * @param id - User id
 * @param fullAccess - Only view access or full access
 */
export const addAdmin = (
  userId: number,
  fullAccess: boolean
): ThunkAction<void, RootState, unknown, AdminsAction> => async (dispatch) => {
  try {
    dispatch({
      type: adminsReducerTypes.addLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/admin/user/addadmin', {
      userId,
      fullAccess,
    });
    dispatch({
      type: adminsReducerTypes.addLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: adminsReducerTypes.addLoadingStatus,
      payload: 'error',
    });
  }
};

interface SearchUsersAction {
  type: typeof adminsReducerTypes.search;
  payload: IUserModel[];
}

interface SearchLoadingStatusAction {
  type: typeof adminsReducerTypes.searchLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Search users by username action
 * @param search - Username
 */
export const searchUsers = (
  search: string
): ThunkAction<void, RootState, unknown, AdminsAction> => async (dispatch) => {
  try {
    dispatch({
      type: adminsReducerTypes.searchLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get(
      `/api/admin/user/search?username=${search}`
    );
    dispatch({
      type: adminsReducerTypes.search,
      payload: response.data.users,
    });
    dispatch({
      type: adminsReducerTypes.searchLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: adminsReducerTypes.searchLoadingStatus,
      payload: 'error',
    });
  }
};

export type AdminsAction =
  | SearchUsersAction
  | GetAdminsAction
  | SearchLoadingStatusAction;
