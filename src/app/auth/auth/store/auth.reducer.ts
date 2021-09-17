import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import {
  authenticateFail,
  authenticateSuccess,
  autoLogin,
  autoLogout,
  clearError,
  loginStart,
  logout,
  signupStart,
} from './auth.action';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

const _authReducer = createReducer(
  initialState,
  on(authenticateSuccess, (state, action) => ({
    ...state,
    user: new User(
      action.payload.email,
      action.payload.userId,
      action.payload.token,
      action.payload.expirationDate
    ),
    authError: null,
    loading: false,
  })),
  on(logout, (state) => ({ ...state, user: null })),
  on(loginStart, (state, action) => ({
    ...state,
    authError: null,
    loading: true,
  })),
  on(autoLogin, (state) => ({
    ...state,
  })),
  on(autoLogout, (state) => ({
    ...state,
    user: null,
  })),
  on(authenticateFail, (state, action) => ({
    ...state,
    user: null,
    authError: action.errorMessage,
    loading: false,
  })),
  on(signupStart, (state, action) => ({
    ...state,
    loading: true,
    authError: null,
  })),
  on(clearError, (state) => ({
    ...state,
    authError: null,
  }))
);

export const AuthReducer = (state, action) => {
  return _authReducer(state, action);
};
