import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request: ' + (error.error.message || 'Invalid data submitted');
              break;
            case 401:
              errorMessage = 'Unauthorized: Please login again';
              // Clear token and redirect to login
              localStorage.removeItem('jwtToken');
              localStorage.removeItem('currentUser');
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Forbidden: You do not have permission to access this resource';
              break;
            case 404:
              errorMessage = 'Not Found: The requested resource was not found';
              break;
            case 500:
              errorMessage = 'Internal Server Error: Please try again later';
              break;
            default:
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }

        console.error('HTTP Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
