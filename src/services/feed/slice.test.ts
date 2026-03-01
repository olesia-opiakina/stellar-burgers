import { feedReducer } from './slice';
import { getFeedsThunk } from './actions';

describe('tests for feedSlice', () => {
  it('Возвращает initial state при неизвестном action', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    };

    expect(state).toEqual(initialState);
  });

  it('getFeedsThunk.pending: включает загрузку и сбрасывает ошибку', () => {
    let state = feedReducer(undefined, getFeedsThunk.pending('requestId'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getFeedsThunk.fulfilled: записывает данные заказов, выключает загрузку', () => {
    const fulfilledOrders = {
      success: true,
      orders: [
        {
          _id: 'order_1',
          ingredients: ['ing1', 'ing2', 'ing3'],
          status: 'done',
          name: 'Чизбургер',
          createdAt: '2026-03-01',
          updatedAt: '2026-03-01',
          number: 102235
        },
        {
          _id: 'order_2',
          ingredients: ['ing1', 'ing2'],
          status: 'done',
          name: 'Чикенбургер',
          createdAt: '2026-03-01',
          updatedAt: '2026-03-01',
          number: 102234
        }
      ],
      total: 34,
      totalToday: 5
    };

    let state = feedReducer(undefined, getFeedsThunk.pending('requestId'));

    state = feedReducer(
      state,
      getFeedsThunk.fulfilled(fulfilledOrders, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(fulfilledOrders.orders);
    expect(state.total).toBe(fulfilledOrders.total);
    expect(state.totalToday).toBe(fulfilledOrders.totalToday);
  });

  it('getFeedsThunk.rejected: получает ошибку и isLoading false', () => {
    let state = feedReducer(undefined, getFeedsThunk.pending('requestId'));

    state = feedReducer(
      state,
      getFeedsThunk.rejected(new Error('Request failed'), 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Request failed');
  });
});
