import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP interceptor to add JWT token to all requests and handle authentication errors.
 * Automatically adds Authorization header with Bearer token to authenticated requests.
 * Redirects to login page when token is expired (401 Unauthorized).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // Clone request and add authorization header if token exists
  if (token && !req.url.includes('/auth/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors (expired token)
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        // Token has expired, log out the user
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
