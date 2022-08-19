import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(localStorage.getItem('authToken'));
    const authToken = localStorage.getItem('authToken');
    request = request.clone({
      setHeaders: {
        'Authorization': 'Bearer '+ authToken,
      }
    })
    return next.handle(request);

  }
}
