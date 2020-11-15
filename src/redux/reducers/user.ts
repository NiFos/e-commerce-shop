import Axios from 'axios';

const userReducerTypes = {
  auth: 'auth/AUTH',
  me: 'auth/ME',
  meLoadingStatus: 'auth/ME_LOADING_STATUS',
  editLoadingStatus: 'auth/ME_LOADING_STATUS',
  authSetError: 'auth/SET_ERROR',
};

export interface IUserReducer {
  me?: {
    user?: {
      userid: number;
      username: string;
      admin: {
        isAdmin: boolean;
        fullAccess?: boolean;
      };
    };
    cart?: [];
    profileInfo?: {
      orders?: any[];
      username?: string;
      deliveryAddress?: string;
      phone?: string;
      created_on?: string;
    };
  };
  authError?: string;
  meLoadingStatus?: 'loading' | 'loaded' | 'error';
  editLoadingStatus?: 'loading' | 'loaded' | 'error';
}
const initialState: IUserReducer = {};

/**
 * User reducer
 */
export const userReducer = (
  state = initialState,
  { type, payload }: any
): IUserReducer => {
  switch (type) {
    case userReducerTypes.auth: {
      return {
        ...state,
        me: {
          user: payload.user,
        },
      };
    }

    case userReducerTypes.me: {
      return {
        ...state,
        me: {
          ...state.me,
          ...payload,
        },
      };
    }

    case userReducerTypes.meLoadingStatus: {
      return {
        ...state,
        meLoadingStatus: payload,
      };
    }

    case userReducerTypes.editLoadingStatus: {
      return {
        ...state,
        editLoadingStatus: payload,
      };
    }

    case userReducerTypes.authSetError: {
      return {
        ...state,
        authError: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Login action
 * @param data - Login data
 */
export const login = (data: { email: string; password: string }) => async (
  dispatch: any
) => {
  const response = await Axios.post('/api/login', data);
  if (response?.data?.error) {
    dispatch(setAuthError(response.data?.message));
  }
  dispatch({
    type: userReducerTypes.auth,
    payload: response.data,
  });
};

/**
 * Reg action
 * @param data - Reg data
 */
export const register = (data: {
  username: string;
  email: string;
  password: string;
}) => async (dispatch: any) => {
  const response = await Axios.post('/api/register', data);
  if (response?.data?.error) {
    dispatch(setAuthError(response.data?.message));
  }
  dispatch({
    type: userReducerTypes.auth,
    payload: response.data,
  });
};

/**
 * Set auth error message
 * @param message - Message
 */
const setAuthError = (payload: string) => {
  return {
    type: userReducerTypes.authSetError,
    payload,
  };
};

/**
 * Get information about current user
 * @param message - Message
 */
export const meUser = () => async (dispatch: any) => {
  try {
    dispatch({
      type: userReducerTypes.meLoadingStatus,
      payload: 'loading',
    });

    const response = await Axios.get('/api/me', { withCredentials: true });
    dispatch({
      type: userReducerTypes.me,
      payload: response.data,
    });

    dispatch({
      type: userReducerTypes.meLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.meLoadingStatus,
      payload: 'error',
    });
  }
};

/**
 * Logout user
 */
export const logoutUser = () => async (dispatch: any) => {
  try {
    const response = await Axios.get('/api/logout', { withCredentials: true });
  } catch (error) {
    console.log(error);
  } finally {
    dispatch({
      type: userReducerTypes.me,
      payload: {},
    });
  }
};

/**
 * Get profile information
 * @param username - Username
 * @param phone - Phone
 * @param deliveryAddress - Delivery address
 * @param orders - Orders
 */
export const getProfileInfo = (
  username: string,
  phone: string,
  deliveryAddress: string,
  orders: any[]
) => {
  return {
    type: userReducerTypes.me,
    payload: {
      profileInfo: {
        orders,
        username,
        deliveryAddress,
        phone,
      },
    },
  };
};

/**
 * Edit user information
 * @param payload - Phone, Delivery address
 */
export const editUserInfo = (
  phone: string | undefined,
  deliveryAddress: string | undefined
) => async (dispatch: any) => {
  try {
    dispatch({
      type: userReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    const response = await Axios.post(
      '/api/profile/edit',
      { phone, deliveryaddress: deliveryAddress },
      {
        withCredentials: true,
      }
    );
    dispatch({
      type: userReducerTypes.editLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.editLoadingStatus,
      payload: 'error',
    });
  }
};
