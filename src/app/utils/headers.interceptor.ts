import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { PrefrenceService } from './prefrence.service';
import { FingerService } from './finger.service';
import { finalize } from 'rxjs/operators';


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  authToken: any;
  loader: boolean = false;
  subscriptionLoader!: Subscription;

  constructor(private prefService: PrefrenceService, 
    private objService: FingerService) {
    this.subscriptionLoader = this.objService.getLoaderStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.loader = true;
      } else {
        this.loader = false;
      }
    });
    // this.prefService.getStorage('authToken').then(token => {
    //   this.authToken = token
    // });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.objService.updateLoaderStatus(true);
    // console.log(this.prefService.getStorage('authToken'));
    var authToken = localStorage.getItem('authToken');
    request = request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + authToken,
      }
    })
    // this.objService.updateLoaderStatus(false);
    return next.handle(request)
    .pipe(finalize(() => this.objService.updateLoaderStatus(false)));
  }
}
