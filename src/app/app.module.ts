import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UrlSenitizePipe } from './utils/url-senitize.pipe';
import { LoginComponent } from './signin/login/login.component';
import { RegistrationComponent } from './signin/registration/registration.component';
import { HomeComponent } from './main/home/home.component';
import { ProfileComponent } from './main/profile/profile.component';
import { WalletComponent } from './main/wallet/wallet.component';
import { GameComponent } from './main/game/game.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FingerService } from './utils/finger.service';
import { DatePipe } from '@angular/common';
import { HeadersInterceptor } from './utils/headers.interceptor';
import { Angular4PaystackModule } from 'angular4-paystack';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseService } from './utils/firebase.service';
import { LocalNotificationService } from './utils/local-notification.service';
import { EchoService } from './utils/echo.service';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { SliderComponent } from './signin/slider/slider.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    UrlSenitizePipe,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    ProfileComponent,
    WalletComponent,
    GameComponent,
    SliderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Angular4PaystackModule.forRoot('pk_live_06fe9ecec7de094c72e9ea9468cff638a26c838d'),
    ToastrModule.forRoot(), 
    BrowserAnimationsModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgbModule,
    NgxUiLoaderModule,
  ],
  providers: [
    FingerService,
    DatePipe,
    FirebaseService,
    EchoService,
    LocalNotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
