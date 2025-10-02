
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // 1. Clone the request if a token exists
  let clonedReq = req;
  if (authToken) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  // 2. Pass the request to the next handler and catch errors
  return next(clonedReq).pipe(
    catchError((error) => {
      // Check if the error is an HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        // 3. Check for the 401 status code
        if (error.status === 401) {
          console.warn('Authentication failed (401). Clearing token...');
          authService.clearToken();
          // Optionally, redirect the user to the login page here
          // import Router from '@angular/router';
          // const router = inject(Router);
          // router.navigate(['/login']);
        }
      }
      // Re-throw the error so it can be handled by the component that made the original request
      return throwError(() => error);
    })
  );
};
