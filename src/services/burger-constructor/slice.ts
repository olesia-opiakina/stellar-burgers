import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { postOrderThunk } from '../order/actions';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  constructorItems: TConstructorItems;
};

export const initialState: TBurgerConstructorState = {
  constructorItems: { bun: null, ingredients: [] }
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: TConstructorIngredient) => item.id !== action.payload
        );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const items = state.constructorItems.ingredients;

      if (fromIndex === toIndex) return;

      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems,
    selectConstructorBun: (state) => state.constructorItems.bun,
    selectConstructorIngredients: (state) => state.constructorItems.ingredients
  },
  extraReducers: (builder) => {
    builder.addCase(postOrderThunk.fulfilled, (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    });
  }
});

export const {
  selectConstructorItems,
  selectConstructorBun,
  selectConstructorIngredients
} = burgerConstructorSlice.selectors;

export const { setBun, addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
