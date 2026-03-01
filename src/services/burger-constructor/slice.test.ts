import { TIngredient } from '@utils-types';
import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun
} from './slice';
import { postOrderThunk } from '../order/actions';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const testBun: TIngredient = {
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
};

const testIngredient1: TIngredient = {
  _id: 'main-id',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const testIngredient2: TIngredient = {
  _id: 'sauce-id',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('tests for burgerConstructorSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Возвращает initial state при неизвестном action', () => {
    const state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    const initialState = { constructorItems: { bun: null, ingredients: [] } };

    expect(state).toEqual(initialState);
  });

  it('Добавление булки setBun', () => {
    let state = burgerConstructorReducer(undefined, setBun(testBun));

    expect(state.constructorItems.bun).toEqual(testBun);
  });

  it('Добавление ингредиента addIngredient ', () => {
    let state = burgerConstructorReducer(
      undefined,
      addIngredient(testIngredient1)
    );

    expect(state.constructorItems.ingredients).toEqual([
      { ...testIngredient1, id: 'test-uuid' }
    ]);
  });

  it('Удаление ингредиента removeIngredient', () => {
    let state = burgerConstructorReducer(
      undefined,
      addIngredient(testIngredient1)
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);

    state = burgerConstructorReducer(state, removeIngredient('test-uuid'));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('Перемещение ингредиента moveIngredient', () => {
    let state = burgerConstructorReducer(
      undefined,
      addIngredient(testIngredient1)
    );
    state = burgerConstructorReducer(state, addIngredient(testIngredient2));

    expect(state.constructorItems.ingredients.map((i) => i._id)).toEqual([
      'main-id',
      'sauce-id'
    ]);

    state = burgerConstructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.constructorItems.ingredients.map((i) => i._id)).toEqual([
      'sauce-id',
      'main-id'
    ]);
  });

  it('Очистка конструктора после postOrderThunk.fulfilled', () => {
    let state = burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' });

    state = burgerConstructorReducer(state, setBun(testBun));
    state = burgerConstructorReducer(state, addIngredient(testIngredient1));

    expect(state.constructorItems.bun).not.toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(1);

    const fulfilledAction = postOrderThunk.fulfilled(
      {
        _id: 'order-id',
        status: 'done',
        name: 'Бургер',
        createdAt: '2026-03-01',
        updatedAt: '2026-03-01',
        number: 102203,
        ingredients: ['bun-id', 'main-id']
      },
      'requestId',
      ['bun-id', 'main-id']
    );

    state = burgerConstructorReducer(state, fulfilledAction);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toEqual([]);
  });
});
