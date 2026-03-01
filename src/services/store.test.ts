import store, { rootReducer } from './store';
import { setUser } from './user/slice';

describe('tests for store', () => {
  it('Реакция на неизвестный action', () => {
    let state = store.getState();
    let burgerConstructor = state.burgerConstructor;
    let feed = state.feed;
    let ingredients = state.ingredients;
    let order = state.order;
    let profileOrders = state.profileOrders;
    let user = state.user;

    state = rootReducer(state, { type: 'UNKNOWN_ACTION' });

    expect(state.burgerConstructor).toEqual(burgerConstructor);
    expect(state.feed).toEqual(feed);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.order).toEqual(order);
    expect(state.profileOrders).toEqual(profileOrders);
    expect(state.user).toEqual(user);
  });
});
