import { createSlice } from '@reduxjs/toolkit';
import { getIngredientsThunk } from './actions';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.items = payload;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка загрузки';
    });
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
