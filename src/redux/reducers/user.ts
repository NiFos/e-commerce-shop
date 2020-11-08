const userReducerTypes = {
  auth: 'user/AUTH',
};

interface IUserReducer {
  me: {
    user: {
      userid: number;
      username: string;
      isAdmin: boolean;
    };
    cart: [];
  };
}
const initialState: IUserReducer = {
  me: {
    user: {
      userid: 0,
      username: '',
      isAdmin: false,
    },
    cart: [],
  },
};

/**
 * User reducer
 */
export const userReducer = (
  state = initialState,
  { type, payload }: any
): any => {
  switch (type) {
    case userReducerTypes.auth: {
      return {
        ...state,
        me: {
          user: payload.user,
        },
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
