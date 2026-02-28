import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './ingredients/slice';
import { burgerConstructorReducer } from './burger-constructor/slice';
import { orderReducer } from './order/slice';
import { userReducer } from './user/slice';
import { feedReducer } from './feed/slice';
import { profileOrderReducer } from './profile-orders/slice';

const rootReducer = combineSlices({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
