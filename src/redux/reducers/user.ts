import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

const userReducerTypes = {
  auth: 'user/AUTH',
  me: 'user/ME',
  promocode: 'user/PROMOCODE',
  checkoutId: 'user/CHECKOUT_ID',
  getCart: 'user/GET_CART',
  addToCart: 'user/ADD_TO_CART',
  meLoadingStatus: 'user/ME_LOADING_STATUS',
  checkoutLoadingStatus: 'user/CHECKOUT_LOADING_STATUS',
  promocodeLoadingStatus: 'user/PROMOCODE_LOADING_STATUS',
  addToCartLoadingStatus: 'user/ADD_TO_CART_LOADING_STATUS',
  removeFromCartLoadingStatus: 'user/REMOVE_FROM_CART_LOADING_STATUS',
  editLoadingStatus: 'user/ME_LOADING_STATUS',
  authSetError: 'user/SET_ERROR',
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
    cart?: any;
    profileInfo?: {
      orders?: any[];
      username?: string;
      deliveryAddress?: string;
      phone?: string;
      created_on?: string;
    };
  };
  promocode?: {
    discount?: {
      percentage: number;
      promocode: string;
      title: string;
      description: string;
      dateTo: Date;
    };
  };
  checkoutId?: string;
  authError?: string;
  checkoutLoadingStatus?: 'loading' | 'loaded' | 'error';
  promocodeLoadingStatus?: 'loading' | 'loaded' | 'error';
  addToCartLoadingStatus?: 'loading' | 'loaded' | 'error';
  removeFromCartLoadingStatus?: 'loading' | 'loaded' | 'error';
  meLoadingStatus?: 'loading' | 'loaded' | 'error';
  editLoadingStatus?: 'loading' | 'loaded' | 'error';
}
const initialState: IUserReducer = {};

/**
 * User reducer
 */
export const userReducer = (
  state = initialState,
  { type, payload }: UserAction
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

    case userReducerTypes.addToCart: {
      return {
        ...state,
        me: {
          ...state.me,
          cart: [...state.me?.cart, payload],
        },
      };
    }

    case userReducerTypes.getCart: {
      return {
        ...state,
        me: {
          ...state.me,
          cart: payload,
        },
      };
    }

    case userReducerTypes.promocode: {
      return {
        ...state,
        promocode: payload,
      };
    }

    case userReducerTypes.checkoutId: {
      return {
        ...state,
        checkoutId: payload,
      };
    }

    case userReducerTypes.checkoutLoadingStatus: {
      return {
        ...state,
        checkoutLoadingStatus: payload,
      };
    }

    case userReducerTypes.removeFromCartLoadingStatus: {
      return {
        ...state,
        removeFromCartLoadingStatus: payload,
      };
    }

    case userReducerTypes.promocodeLoadingStatus: {
      return {
        ...state,
        promocodeLoadingStatus: payload,
      };
    }

    case userReducerTypes.addToCartLoadingStatus: {
      return {
        ...state,
        addToCartLoadingStatus: payload,
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

interface AuthAction {
  type: typeof userReducerTypes.auth;
  payload: {
    user?: {
      userid: number;
      username: string;
      admin: {
        isAdmin: boolean;
        fullAccess?: boolean;
      };
    };
  };
}
/**
 * Login action
 * @param data - Login data
 */
export const login = (data: {
  email: string;
  password: string;
}): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  const response = await axiosInstance.post('/api/login', data);
  if (response?.data?.error) {
    dispatch(setAuthError(response.data?.message));
  }
  dispatch({
    type: userReducerTypes.auth,
    payload: response.data,
  });
};

interface AddProductToCartAction {
  type: typeof userReducerTypes.addToCart;
  payload: { productId: number; quantity: number }[];
}

/**
 * Add product to cart
 * @param productId - Product id
 */
export const addProductToCart = (
  productId: number,
  quantity: number
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.addToCartLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/cart/add', {
      productId,
      quantity,
    });
    dispatch({
      type: userReducerTypes.addToCart,
      payload: [
        {
          productId,
          quantity,
        },
      ],
    });
    dispatch({
      type: userReducerTypes.addToCartLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.addToCartLoadingStatus,
      payload: error.toString(),
    });
  }
};

/**
 * Reg action
 * @param data - Reg data
 */
export const register = (data: {
  username: string;
  email: string;
  password: string;
}): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  const response = await axiosInstance.post('/api/register', data);
  if (response?.data?.error) {
    dispatch(setAuthError(response.data?.message));
  }
  dispatch({
    type: userReducerTypes.auth,
    payload: response.data,
  });
};

interface SetAuthErrorAction {
  type: typeof userReducerTypes.authSetError;
  payload: string;
}

/**
 * Set auth error message
 * @param message - Message
 */
const setAuthError = (payload: string): SetAuthErrorAction => {
  return {
    type: userReducerTypes.authSetError,
    payload,
  };
};

interface MeUserAction {
  type: typeof userReducerTypes.me;
  payload: {
    user?: {
      userid: number;
      username: string;
      admin: {
        isAdmin: boolean;
        fullAccess?: boolean;
      };
    };
  };
}

/**
 * Get information about current user
 * @param message - Message
 */
export const meUser = (): ThunkAction<
  void,
  RootState,
  unknown,
  UserAction
> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.meLoadingStatus,
      payload: 'loading',
    });

    const response = await axiosInstance.get('/api/me');
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

interface GetCart {
  type: typeof userReducerTypes.getCart;
  payload: any;
}

/**
 * Get cart action
 */
export const getCart = (cart: any[]): GetCart => {
  return {
    type: userReducerTypes.getCart,
    payload: cart,
  };
};

/**
 * Remove from cart action
 */
export const removeFromCart = (
  productId: number
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.removeFromCartLoadingStatus,
      payload: 'loading',
    });

    await axiosInstance.post('/api/cart/remove', {
      productId,
    });

    dispatch({
      type: userReducerTypes.removeFromCartLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.removeFromCartLoadingStatus,
      payload: error,
    });
  }
};

interface GetPromocodeAction {
  type: typeof userReducerTypes.promocode;
  payload: {
    discount?: {
      percentage: number;
      promocode: string;
      title: string;
      description: string;
      dateTo: Date;
    };
  };
}

/**
 * Get information about promocode
 * @param promocode - Promocode
 */
export const getPromocode = (
  promocode: string
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.promocodeLoadingStatus,
      payload: 'loading',
    });

    const response = await axiosInstance.post('/api/promocode', {
      promocode,
    });
    dispatch({
      type: userReducerTypes.promocode,
      payload: response.data,
    });

    dispatch({
      type: userReducerTypes.promocodeLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.promocodeLoadingStatus,
      payload: error,
    });
  }
};

interface CheckoutUserAction {
  type: typeof userReducerTypes.checkoutId;
  payload: string;
}

/**
 * Checkout
 * @param promocode - Promocode
 */
export const checkoutUser = (
  promocode: string
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.checkoutLoadingStatus,
      payload: 'loading',
    });

    const response = await axiosInstance.post('/api/cart/checkout', {
      promocode,
    });
    dispatch({
      type: userReducerTypes.checkoutId,
      payload: response.data.stripeId,
    });

    dispatch({
      type: userReducerTypes.checkoutLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: userReducerTypes.checkoutLoadingStatus,
      payload: error,
    });
  }
};

/**
 * Logout user
 */
export const logoutUser = (): ThunkAction<
  void,
  RootState,
  unknown,
  UserAction
> => async (dispatch) => {
  try {
    await axiosInstance.delete('/api/logout');
  } catch (error) {
    console.log(error);
  } finally {
    dispatch({
      type: userReducerTypes.me,
      payload: {},
    });
  }
};

interface GetProfileInfoAction {
  type: typeof userReducerTypes.me;
  payload: {
    profileInfo?: {
      orders?: any[];
      username?: string;
      deliveryAddress?: string;
      phone?: string;
      created_on?: string;
    };
  };
}

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
  orders?: any[]
): GetProfileInfoAction => {
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
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({
      type: userReducerTypes.editLoadingStatus,
      payload: 'loading',
    });
    await axiosInstance.post('/api/profile/edit', {
      phone,
      deliveryaddress: deliveryAddress,
    });
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

export type UserAction =
  | GetProfileInfoAction
  | CheckoutUserAction
  | GetPromocodeAction
  | GetCart
  | MeUserAction
  | SetAuthErrorAction
  | AuthAction
  | AddProductToCartAction;
