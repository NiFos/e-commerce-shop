export const settingsReducerTypes = {
  changeLanguage: 'settings/CHANGE_LANGUAGE',
  currentRoute: 'settings/CHANGE_CURRENT_ROUTE',
};
export interface ISettingsReducer {
  language?: 'ru' | 'en';
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
  { type, payload }: SettingsAction
): ISettingsReducer => {
  switch (type) {
    case settingsReducerTypes.changeLanguage: {
      return {
        ...state,
        language: payload as 'ru' | 'en',
      };
    }

    case settingsReducerTypes.currentRoute: {
      return {
        ...state,
        currentRoute: payload as IBreadcrum[],
      };
    }

    default: {
      return state;
    }
  }
};

// Actions

interface ChangeLanguageAction {
  type: typeof settingsReducerTypes.changeLanguage;
  payload: 'ru' | 'en';
}

/**
 * Change language action
 */
export const changeLanguage = (language: 'ru' | 'en'): ChangeLanguageAction => {
  localStorage.setItem('language', language);
  return {
    type: settingsReducerTypes.changeLanguage,
    payload: language,
  };
};

interface ChangeRouteAction {
  type: typeof settingsReducerTypes.currentRoute;
  payload: IBreadcrum[];
}

/**
 * Change route action
 */
export const changeRoute = (info: {
  categoryId?: number;
  productId?: number;
  productTitle?: string;
  categoryTitle?: string;
}): ChangeRouteAction => {
  const breadcrums: IBreadcrum[] = [];
  breadcrums.push({ title: 'HOME', route: '/' });

  breadcrums.push({
    title: `${info.categoryTitle?.toUpperCase()}`,
    route: `/category/${info.categoryId}`,
  });
  breadcrums.push({
    title: `${info.productTitle?.toUpperCase()}`,
    route: `/product/${info.productId}`,
  });

  return {
    type: settingsReducerTypes.currentRoute,
    payload: breadcrums,
  };
};

export type SettingsAction = ChangeRouteAction | ChangeLanguageAction;
