import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrefrenceService } from './prefrence.service';


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  authToken: any;
  constructor(private prefService: PrefrenceService) {
    // this.prefService.getStorage('authToken').then(token => {
    //   this.authToken = token
    // });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // console.log(this.prefService.getStorage('authToken'));
    var authToken = localStorage.getItem('authToken');
    request = request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + authToken,
      }
    })

    return next.handle(request);
  }
}
