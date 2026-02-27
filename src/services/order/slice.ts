import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { postOrderThunk } from './actions';

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder.addCase(postOrderThunk.pending, (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
      state.error = null;
    });
    builder.addCase(postOrderThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      state.error = null;
    });
    builder.addCase(postOrderThunk.rejected, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = action.error.message ?? 'Ошибка заказа';
    });
  }
});

export const { selectOrderRequest, selectOrderModalData } =
  orderSlice.selectors;
export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
