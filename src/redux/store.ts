/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { rootReducer } from './reducers';
import { AdminsAction } from './reducers/admins';
import { CategoryAction } from './reducers/category';
import { DiscountsAction } from './reducers/discounts';
import { OrdersAction } from './reducers/orders';
import { ProductsAction } from './reducers/products';
import { SearchAction } from './reducers/search';
import { SettingsAction } from './reducers/settings';
import { UserAction } from './reducers/user';

let store: any;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  process.env.NODE_ENV === 'production'
    ? compose
    : (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;

/**
 * Init redux store
 */
function initStore(initialState?: RootState) {
  return createStore(
    rootReducer,
    initialState || {},
    composeEnhancers(
      applyMiddleware(thunk as ThunkMiddleware<RootState, RootActions>)
    )
  );
}

/**
 * Initialize store
 */
export const initializeStore = (preloadedState?: RootState): any => {
  let _store = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    _store = initStore({
      ...store?.getState(),
      ...preloadedState,
    });

    store = undefined;
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;
  return _store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type RootActions =
  | UserAction
  | SettingsAction
  | SearchAction
  | ProductsAction
  | OrdersAction
  | DiscountsAction
  | CategoryAction
  | AdminsAction;

/**
 * useStore hook
 */
export const useStore = (
  initialState: RootState
): Store<RootState, RootActions> => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};
