import { useMemo } from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

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
function initStore(initialState: any) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
}

/**
 * Initialize store
 */
export const initializeStore = (preloadedState: any) => {
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

/**
 * useStore hook
 */
export const useStore = (initialState: any) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};
