import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FingerService {
  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient, 
    private toastr: ToastrService,
    ) { }

  // signInWithGoogle(googleLoginOptions: any): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
  // }
  // signInWithFacebook(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }
  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }
  login(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/login', obj);
  }
  logout() {
    return this.httpClient.post(this.baseUrl + '/api/logout', {});
  }
  firebaseLogin(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/firebase-login', obj);
  }
  register(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/register', obj);
  }
  getProfile() {
    return this.httpClient.get(this.baseUrl + '/api/user');
  }
  getSetting() {
    return this.httpClient.get(this.baseUrl + '/api/setting');
  }
  updateProfile(obj: any) {
    console.log(obj);
    var header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'multipart/form-data')
    }
    return this.httpClient.post(this.baseUrl + '/api/profile', obj);
  }
  getBanners(obj: any) {
    return this.httpClient.get(this.baseUrl + '/api/banners', obj);
  }
  getBanner(obj: any) {
    return this.httpClient.get(this.baseUrl + '/api/banner', obj);
  }
  getEvents() {
    return this.httpClient.get(this.baseUrl + '/api/game-events');
  }
  getEvent(obj: any) {
    return this.httpClient.get(this.baseUrl + `/api/game-events/${obj.game_event_id}`);
  }
  joinEvent(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/game-events/join-event', obj);
  }
  enterEvent(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/game-events/enter-event', obj);
  }
  myEvent() {
    return this.httpClient.get(this.baseUrl + '/api/my-join-event');
  }
  getTransactions() {
    return this.httpClient.get(this.baseUrl + '/api/users/user-wallets');
  }
  walletCredit(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/users/user-wallets', obj);
  }
  paystack(obj: any) {
    return this.httpClient.get(this.baseUrl + `/api/paystack/${obj.email}/${obj.amount}`);
  }
  getlifePackages(obj: any) {
    return this.httpClient.get(this.baseUrl + '/api/life-packages', obj);
  }
  lifeCredit(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/buy-life', obj);
  }
  authorizer(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/broadcasting/auth', obj);
  }
  showSuccessToast(successMessage: any, successitle: any){
    this.toastr.success(successMessage, successitle);
  }
  showErrorToast(errorMessage: any, errorTitle: any){
    this.toastr.error(errorMessage, errorTitle);
  }
}

