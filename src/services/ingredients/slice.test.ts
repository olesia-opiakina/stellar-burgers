import { ingredientsReducer } from './slice';
import { getIngredientsThunk } from './actions';
import { TIngredient } from '@utils-types';

describe('tests for ingredientsSlice', () => {
  it('Возвращает initial state при неизвестном action', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const initialState = { items: [], isLoading: false, error: null };
    expect(state).toEqual(initialState);
  });

  it('getIngredientsThunk.pending: включает загрузку и сбрасывает ошибку', () => {
    let state = ingredientsReducer(
      undefined,
      getIngredientsThunk.pending('requestId')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getIngredientsThunk.fulfilled: записывает данные ингредиентов и выключает загрузку', () => {
    const ingredients: TIngredient[] = [
      {
        _id: 'bun-id',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      {
        _id: 'sauce-id',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
      }
    ];

    let state = ingredientsReducer(
      undefined,
      getIngredientsThunk.pending('requestId')
    );

    state = ingredientsReducer(
      state,
      getIngredientsThunk.fulfilled(ingredients, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(ingredients);
  });

  it('getIngredientsThunk.rejected: получает ошибку и isLoading false', () => {
    let state = ingredientsReducer(
      undefined,
      getIngredientsThunk.pending('requestId')
    );

    state = ingredientsReducer(
      state,
      getIngredientsThunk.rejected(new Error('Request failed'), 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Request failed');
  });
});
