import { createSlice } from '@reduxjs/toolkit';
import { getUserOrdersThunk } from './actions';
import { TOrder } from '@utils-types';

type TProfileOrderState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TProfileOrderState = {
  orders: [],
  isLoading: false,
  error: null
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileIsLoading: (state) => state.isLoading,
    selectProfileError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder.addCase(getUserOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.error = null;
    });
    builder.addCase(getUserOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка загрузки заказов';
    });
  }
});

export const {
  selectProfileOrders,
  selectProfileIsLoading,
  selectProfileError
} = profileOrdersSlice.selectors;

export const profileOrderReducer = profileOrdersSlice.reducer;
