import Axios from 'axios';

const userReducerTypes = {
  auth: 'auth/AUTH',
  me: 'auth/ME',
  authSetError: 'auth/SET_ERROR',
};

export interface IUserReducer {
  me?: {
    user?: {
      id: number;
      username: string;
      admin: {
        isAdmin: boolean;
        fullAccess?: boolean;
      };
    };
    cart?: [];
  };
  authError?: string;
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
          user: payload.user,
        },
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
 * Set auth error message
 * @param message - Message
 */
export const meUser = (payload: any) => {
  return {
    type: userReducerTypes.me,
    payload,
  };
};
