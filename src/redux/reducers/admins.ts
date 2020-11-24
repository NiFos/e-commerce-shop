import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const adminsReducerTypes = {
  getAdmins: 'admins/GET_ADMINS',
  search: 'admins/SEARCH',
  addLoadingStatus: 'admins/ADD_LOADING_STATUS',
  editLoadingStatus: 'admins/EDIT_LOADING_STATUS',
  deleteLoadingStatus: 'admins/DELETE_LOADING_STATUS',
  searchLoadingStatus: 'admins/SEARCH_LOADING_STATUS',
};
export interface IAdminsReducer {
  admins?: any[];
  search?: any[];
  addLoadingStatus?: 'loading' | 'error' | 'loaded';
  editLoadingStatus?: 'loading' | 'error' | 'loaded';
  deleteLoadingStatus?: 'loading' | 'error' | 'loaded';
  searchLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: IAdminsReducer = {};

/**
 * Admins reducer
 */
export const adminsReducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case adminsReducerTypes.getAdmins: {
      return {
        ...state,
        admins: payload,
      };
    }

    case adminsReducerTypes.search: {
      return {
        ...state,
        search: payload,
      };
    }

    case adminsReducerTypes.addLoadingStatus: {
      return {
        ...state,
        addLoadingStatus: payload,
      };
    }

    case adminsReducerTypes.deleteLoadingStatus: {
      return {
        ...state,
        deleteLoadingStatus: payload,
      };
    }

    case adminsReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload,
      };
    }

    case adminsReducerTypes.searchLoadingStatus: {
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
 * Get admins action
 */
export const getAdmins = (admins: any[]) => {
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
export const editAdmin = (id: number, fullAccess: boolean) => async (
  dispatch: any
) => {
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
export const deleteAdmin = (id: number) => async (dispatch: any) => {
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
export const addAdmin = (id: number, fullAccess: boolean) => async (
  dispatch: any
) => {
  try {
    dispatch({
      type: adminsReducerTypes.addLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/admin/user/addadmin', {
      userid: id,
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

/**
 * Search users by username action
 * @param search - Username
 */
export const searchUsers = (search: string) => async (dispatch: any) => {
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
