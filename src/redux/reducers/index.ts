import { combineReducers } from 'redux';
import { ordersReducer } from './orders';
import { settingsReducer } from './settings';
import { userReducer } from './user';
import { categoriesReducer } from './categories';
import { categoryReducer } from './category';
import { adminsReducer } from './admins';
import { discountsReducer } from './discounts';
import { productsReducer } from './products';
import { searchReducer } from './search';
import { tagsReducer } from './tags';

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  settings: settingsReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  admins: adminsReducer,
  discounts: discountsReducer,
  products: productsReducer,
  search: searchReducer,
  tags: tagsReducer,
});
