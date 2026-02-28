import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserAuth
} from './actions';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  error: string | null;
  isAuthChecked: boolean;
};

export const initialState: TUserState = {
  user: null,
  error: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка входа';
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка выхода';
      state.user = null;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.error = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка регистрации';
    });
    builder.addCase(updateUserAuth.fulfilled, (state, action) => {
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(updateUserAuth.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка обновления профиля';
    });
  }
});

export const { selectUser, selectIsAuthChecked, selectError } =
  userSlice.selectors;
export const { setIsAuthChecked, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
