import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TLoginData, TRegisterData } from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { setUser, setIsAuthChecked } from '../../services/user/slice';

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const loginData = await loginUserApi(data);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    setCookie('accessToken', loginData.accessToken);
    return loginData;
  }
);

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  const logoutData = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return logoutData;
});

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const registerData = await registerUserApi(data);
    localStorage.setItem('refreshToken', registerData.refreshToken);
    setCookie('accessToken', registerData.accessToken);
    return registerData;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      dispatch(setUser(null));
      dispatch(setIsAuthChecked(true));
      return;
    }
    const checkData = await getUserApi();
    dispatch(setUser(checkData.user));
    dispatch(setIsAuthChecked(true));
  }
);

export const updateUserAuth = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const updateData = await updateUserApi(data);
    return updateData.user;
  }
);
