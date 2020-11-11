import { combineReducers } from 'redux';
import { ordersReducer } from './orders';
import { settingsReducer } from './settings';
import { userReducer } from './user';
import { categoriesReducer } from './categories';

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  settings: settingsReducer,
  categories: categoriesReducer,
});
