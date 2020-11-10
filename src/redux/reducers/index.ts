import { combineReducers } from 'redux';
import { ordersReducer } from './orders';
import { settingsReducer } from './settings';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  settings: settingsReducer,
});
