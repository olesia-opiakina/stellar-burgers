import { orderReducer, clearOrder } from './slice';
import { postOrderThunk } from './actions';

const testOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2026-03-01',
  updatedAt: '2026-03-01',
  number: 102235,
  ingredients: ['bun-id', 'main-id']
};

describe('tests for orderSlice', () => {
  it('Возвращает initial state при неизвестном action', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const initialState = {
      orderModalData: null,
      orderRequest: false,
      error: null
    };

    expect(state).toEqual(initialState);
  });

  it('postOrderThunk.pending: включает orderRequest и сбрасывает данные', () => {
    let state = orderReducer(
      undefined,
      postOrderThunk.pending('requestId', [])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  it('postOrderThunk.fulfilled: записывает заказ и выключает загрузку', () => {
    let state = orderReducer(
      undefined,
      postOrderThunk.pending('requestId', [])
    );

    state = orderReducer(
      state,
      postOrderThunk.fulfilled(testOrder, 'requestId', [])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderModalData).toEqual(testOrder);
  });

  it('postOrderThunk.rejected: выключает загрузку и записывает ошибку', () => {
    let state = orderReducer(
      undefined,
      postOrderThunk.pending('requestId', [])
    );

    state = orderReducer(
      state,
      postOrderThunk.rejected(new Error('Request failed'), 'requestId', [])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBe('Request failed');
  });

  it('clearOrder: очищает данные заказа', () => {
    let state = orderReducer(
      undefined,
      postOrderThunk.fulfilled(testOrder, 'requestId', [])
    );

    state = orderReducer(state, clearOrder());

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
