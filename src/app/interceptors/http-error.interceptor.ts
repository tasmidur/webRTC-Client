import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('HttpErrorInterceptor');

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Server error: ${error.status} - ${error.message}`;
          if (error.status === 401) {
            errorMessage = 'Invalid password.\nPlease try again.';
          } else if (error.status === 403) {
            errorMessage = 'Session expired.\nPlease log in again.';
          }
        }
        console.log('HttpErrorInterceptor', errorMessage);

        // Set error message for the login component
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
