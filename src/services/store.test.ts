import { initialState as burgerInitialState } from './burger-constructor/slice';
import { initialState as feedInitialState } from './feed/slice';
import { initialState as ingredientsInitialState } from './ingredients/slice';
import { initialState as orderInitialState } from './order/slice';
import { initialState as profileOrdersInitialState } from './profile-orders/slice';
import { initialState as userInitialState } from './user/slice';
import store, { rootReducer } from './store';

describe('tests for store', () => {
  it('Реакция на неизвестный action', () => {
    let state = store.getState();

    state = rootReducer(state, { type: 'UNKNOWN_ACTION' });

    expect(state.burgerConstructor).toEqual(burgerInitialState);
    expect(state.feed).toEqual(feedInitialState);
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.order).toEqual(orderInitialState);
    expect(state.profileOrders).toEqual(profileOrdersInitialState);
    expect(state.user).toEqual(userInitialState);
  });
});
