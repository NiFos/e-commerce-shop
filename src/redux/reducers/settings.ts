const settingsReducerTypes = {
  changeLanguage: 'settings/CHANGE_LANGUAGE',
};
export interface ISettingsReducer {
  language: 'ru' | 'en';
}
const initialState: ISettingsReducer = {
  language: 'ru',
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
  return {
    type: settingsReducerTypes.changeLanguage,
    payload: language,
  };
};
