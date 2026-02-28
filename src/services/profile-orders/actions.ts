import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUserOrdersThunk = createAsyncThunk(
  'profileOrders/getUserOrders',
  async () => getOrdersApi()
);
