const settingsReducerTypes = {
  changeLanguage: 'settings/CHANGE_LANGUAGE',
  currentRoute: 'settings/CHANGE_CURRENT_ROUTE',
};
export interface ISettingsReducer {
  language: 'ru' | 'en';
  currentRoute?: IBreadcrum[];
}
export interface IBreadcrum {
  title: string;
  route: string;
}

const initialState: ISettingsReducer = {
  language: 'en',
  currentRoute: [{ title: 'HOME', route: '/' }],
};

/**
 * Settings reducer
 */
export const settingsReducer = (
  state = initialState,
  { type, payload }: any
) => {
  switch (type) {
    case settingsReducerTypes.changeLanguage: {
      return {
        ...state,
        language: payload,
      };
    }

    case settingsReducerTypes.currentRoute: {
      return {
        ...state,
        currentRoute: payload,
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
/**
 * Change language action
 */
export const changeLanguage = (language: 'ru' | 'en') => {
  localStorage.setItem('language', language);
  return {
    type: settingsReducerTypes.changeLanguage,
    payload: language,
  };
};

/**
 * Change route action
 */
export const changeRoute = (
  type: 'product' | 'category' | 'cart',
  info: {
    categoryId?: number;
    productId?: number;
    productTitle?: string;
    categoryTitle?: string;
  }
) => {
  const breadcrums: IBreadcrum[] = [];
  breadcrums.push({ title: 'HOME', route: '/' });

  switch (type) {
    case 'product':
      breadcrums.push({
        title: `${info.categoryTitle?.toUpperCase()}`,
        route: `/category/${info.categoryId}`,
      });
      breadcrums.push({
        title: `${info.productTitle?.toUpperCase()}`,
        route: `/product/${info.productId}`,
      });
      break;

    case 'category':
      breadcrums.push({
        title: `${info.categoryTitle?.toUpperCase()}`,
        route: `${type}/${info.categoryId}`,
      });
      break;

    case 'cart':
      breadcrums.push({
        title: 'CART',
        route: '/cart',
      });
      break;

    default:
      break;
  }

  return {
    type: settingsReducerTypes.currentRoute,
    payload: breadcrums,
  };
};
