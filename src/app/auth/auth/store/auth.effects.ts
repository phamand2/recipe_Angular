import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  AuthResponseData,
  AuthServiceService,
} from '../../auth-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User } from '../user.model';
import { authenticateFail, authenticateSuccess } from './auth.action';

const handleAuthentication = (response: AuthResponseData): Action => {
  const expiresInMillis = +response.expiresIn * 1000;
  const expirationDate = new Date(new Date().getTime() + expiresInMillis);
  const user = new User(
    response.email,
    response.localId,
    response.idToken,
    expirationDate
  );
  localStorage.setItem('user', JSON.stringify(user));

  return AuthActions.authenticateSuccess({
    payload: {
      email: response.email,
      userId: response.localId,
      token: response.idToken,
      expirationDate,
      redirect: true,
    },
  });
};

const handleError = (errorResponse: HttpErrorResponse): Observable<Action> => {
  let errorMessage = 'An Unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(AuthActions.authenticateFail({ errorMessage }));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage =
        'We have blocked all requests from this device due to ' +
        'unusual activity. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage =
        'There is no user record corresponding to this identifier.' +
        ' The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage =
        'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
  }
  return of(AuthActions.authenticateFail({ errorMessage }));
};

@Injectable()
export class AuthEffects {
  // @ts-ignore
  authLogin$ = createEffect(() => {
    // @ts-ignore
    return this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((actionData) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
              email: actionData.email,
              password: actionData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(this.setLogoutTimer.bind(this)),
            map(handleAuthentication),
            catchError(handleError)
          );
      })
    );
  });

  // @ts-ignore
  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateSuccess),
        tap((actionData) => {
          // @ts-ignore
          if (actionData.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  // @ts-ignore
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      // @ts-ignore
      switchMap((actionData) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}
    `,
            {
              email: actionData.email,
              password: actionData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(this.setLogoutTimer.bind(this)),
            map(handleAuthentication),
            catchError(handleError)
          );
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('user');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  // @ts-ignore
  authAutoLogin$ = createEffect(() =>
    // @ts-ignore
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
          return;
        }

        if (userData._token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);

          return authenticateSuccess({
            payload: {
              email: userData.email,
              userId: userData.id,
              token: userData._token,
              expirationDate: new Date(userData._tokenExpirationDate),
              redirect: false,
            },
          });
        }
      })
    )
  );

  authAutoLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogout),
      tap(() => {
        AuthActions.logout();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  private setLogoutTimer(response: AuthResponseData) {
    console.log(+response.expiresIn * 1000);
    this.authService.setLogoutTimer(+response.expiresIn * 1000);
  }
}
