import { initialState, setIsAuthChecked, setUser, userReducer } from './slice';
import {
  checkUserAuth,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserAuth
} from './actions';
import { TUser } from '@utils-types';
import { getCookie } from '../../utils/cookie';
import { getUserApi } from '@api';

const oldUser: TUser = {
  email: 'me@test.com',
  name: 'Old Name'
};

const updatedUser: TUser = {
  email: 'me@test.com',
  name: 'Updated Name'
};

const dispatch = jest.fn();

jest.mock('../../utils/cookie', () => ({
  getCookie: jest.fn()
}));

jest.mock('../../utils/burger-api', () => ({
  getUserApi: jest.fn()
}));

describe('tests for userSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Возвращает initial state при неизвестном action', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(initialState);
  });

  it('loginUserThunk.fulfilled: записывает user, ставит isAuthChecked=true, сбрасывает error', () => {
    const loginPayload = {
      success: true,
      accessToken: 'Bearer test-access-token',
      refreshToken: 'test-refresh-token',
      user: oldUser
    };

    let state = userReducer(
      undefined,
      loginUserThunk.fulfilled(loginPayload, 'requestId', {
        email: 'me@test.com',
        password: 'password'
      })
    );

    expect(state.user).toEqual(loginPayload.user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUserThunk.rejected: записывает error', () => {
    let state = userReducer(
      undefined,
      loginUserThunk.rejected(new Error('Login failed'), 'requestId', {
        email: 'me@test.com',
        password: 'password'
      })
    );

    expect(state.error).toBe('Login failed');
  });

  it('logoutUserThunk.fulfilled: очищает user и error', () => {
    let state = userReducer(undefined, setUser(oldUser));

    state = userReducer(
      state,
      logoutUserThunk.fulfilled({ success: true }, 'requestId')
    );

    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('logoutUserThunk.rejected: записывает error и очищает user', () => {
    let state = userReducer(undefined, setUser(oldUser));

    state = userReducer(
      state,
      logoutUserThunk.rejected(new Error('Logout failed'), 'requestId')
    );

    expect(state.user).toBeNull();
    expect(state.error).toBe('Logout failed');
  });

  it('registerUserThunk.fulfilled: записывает user, ставит isAuthChecked=true, сбрасывает error', () => {
    const registerPayload = {
      success: true,
      accessToken: 'Bearer test-access-token',
      refreshToken: 'test-refresh-token',
      user: {
        email: 'new@test.com',
        name: 'New User'
      }
    };

    let state = userReducer(
      undefined,
      registerUserThunk.fulfilled(registerPayload, 'requestId', {
        email: 'new@test.com',
        password: 'password',
        name: 'New User'
      })
    );

    expect(state.user).toEqual(registerPayload.user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('registerUserThunk.rejected: записывает error', () => {
    let state = userReducer(
      undefined,
      registerUserThunk.rejected(new Error('Register failed'), 'requestId', {
        email: 'new@test.com',
        password: 'password',
        name: 'New User'
      })
    );

    expect(state.error).toBe('Register failed');
    expect(state.user).toBeNull();
  });

  it('updateUserAuth.fulfilled: обновляет user и сбрасывает error', () => {
    let state = userReducer(undefined, setUser(oldUser));

    state = userReducer(
      state,
      updateUserAuth.fulfilled(updatedUser, 'requestId', {
        name: 'Updated Name'
      })
    );

    expect(state.user).toEqual(updatedUser);
    expect(state.error).toBeNull();
  });

  it('updateUserAuth.rejected: записывает error', () => {
    let state = userReducer(undefined, setUser(oldUser));

    state = userReducer(
      state,
      updateUserAuth.rejected(new Error('Update failed'), 'requestId', {
        name: 'Updated Name'
      })
    );

    expect(state.error).toBe('Update failed');
    expect(state.user).toEqual(oldUser);
  });

  it('setUser: установка пользователя', () => {
    let state = userReducer(undefined, setUser(oldUser));
    expect(state.user).toEqual(oldUser);

    state = userReducer(state, setUser(null));
    expect(state.user).toBeNull();
  });

  it('setIsAuthChecked: установка флага аутентификации', () => {
    let state = userReducer(undefined, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);

    state = userReducer(undefined, setIsAuthChecked(false));
    expect(state.isAuthChecked).toBe(false);
  });

  it('checkUserAuth: проверка аутентификации без токена', async () => {
    (getCookie as jest.Mock).mockReturnValue('');

    await checkUserAuth()(dispatch, jest.fn(), undefined);

    expect(getUserApi).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(setUser(null));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthChecked(true));
  });

  it('checkUserAuth: проверка аутентификации с токеном', async () => {
    (getCookie as jest.Mock).mockReturnValue('test-token');
    (getUserApi as jest.Mock).mockReturnValue({ success: true, user: oldUser });

    await checkUserAuth()(dispatch, jest.fn(), undefined);

    expect(getUserApi).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(setUser(oldUser));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthChecked(true));
  });
});
