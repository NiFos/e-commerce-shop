import { combineReducers } from 'redux';
import { ordersReducer } from './orders';
import { settingsReducer } from './settings';
import { userReducer } from './user';
import { categoriesReducer } from './categories';
import { adminsReducer } from './admins';
import { discountsReducer } from './discounts';

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  settings: settingsReducer,
  categories: categoriesReducer,
  admins: adminsReducer,
  discounts: discountsReducer,
});
