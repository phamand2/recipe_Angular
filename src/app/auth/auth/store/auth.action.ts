import { createAction, props } from '@ngrx/store';

export const authenticateSuccess = createAction(
  '[Auth] authenticateSuccess',
  props<{
    payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    };
  }>()
);

export const logout = createAction('[Auth] Logout');

export const loginStart = createAction(
  '[Auth] login_start',
  props<{
    email: string;
    password: string;
  }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ errorMessage: string }>()
);

export const clearError = createAction('[Auth] Clear Error');

export const autoLogin = createAction('[Auth] Auto Login');

export const autoLogout = createAction('[Auth] Auto Logout');

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    email: string;
    password: string;
  }>()
);
