import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const postOrderThunk = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientsId: string[]) => {
    const postOrder = await orderBurgerApi(ingredientsId);
    const order = postOrder.order;
    return {
      _id: order._id,
      status: order.status,
      name: order.name,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      number: order.number,
      ingredients: ingredientsId
    };
  }
);
