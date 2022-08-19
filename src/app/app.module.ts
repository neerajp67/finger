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

@NgModule({
  declarations: [
    AppComponent,
    UrlSenitizePipe,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    ProfileComponent,
    WalletComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Angular4PaystackModule.forRoot('pk_test_34def31984d3b4c04ab3eda06561eed0b3ed1d0e'),
  ],
  providers: [
    FingerService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
