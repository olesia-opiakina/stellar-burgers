import { profileOrderReducer } from './slice';
import { getUserOrdersThunk } from './actions';
import type { TOrder } from '@utils-types';

describe('tests for profileOrdersSlice', () => {
  it('Возвращает initial state при неизвестном action', () => {
    const state = profileOrderReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const initialState = {
      orders: [],
      isLoading: false,
      error: null
    };

    expect(state).toEqual(initialState);
  });

  it('getUserOrdersThunk.pending: включает загрузку и сбрасывает ошибку', () => {
    let state = profileOrderReducer(
      undefined,
      getUserOrdersThunk.pending('requestId')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getUserOrdersThunk.fulfilled: записывает заказы и выключает загрузку', () => {
    const orders: TOrder[] = [
      {
        _id: 'order-1',
        status: 'done',
        name: 'Флюоресцентный бургер',
        createdAt: '2026-03-01',
        updatedAt: '2026-03-01',
        number: 102235,
        ingredients: ['bun-id', 'main-id']
      },
      {
        _id: 'order-2',
        status: 'done',
        name: 'Чикенбургер',
        createdAt: '2026-03-01',
        updatedAt: '2026-03-01',
        number: 102234,
        ingredients: ['bun-id']
      }
    ];

    let state = profileOrderReducer(
      undefined,
      getUserOrdersThunk.pending('requestId')
    );

    state = profileOrderReducer(
      state,
      getUserOrdersThunk.fulfilled(orders, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(orders);
  });

  it('getUserOrdersThunk.rejected: выключает загрузку и записывает ошибку', () => {
    let state = profileOrderReducer(
      undefined,
      getUserOrdersThunk.pending('requestId')
    );

    state = profileOrderReducer(
      state,
      getUserOrdersThunk.rejected(new Error('Request failed'), 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Request failed');
  });
});
