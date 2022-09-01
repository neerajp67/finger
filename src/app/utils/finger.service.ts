import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FingerService {
  private lifepopupsubject = new Subject<any>();
  private reminderpopupsubject = new Subject<any>();
  private loaderSubject = new Subject<any>();
  private homeLoader = new Subject<any>();
  private iframVisibility = new Subject<any>();

  private myEvents = new Subject<any>();
  private upcomingEvents = new Subject<any>();
  baseUrl = environment.baseUrl;

  private gameWon = new Subject<any>();
  private gameLost = new Subject<any>();
  private gameEnd = new Subject<any>();
  private participants = new Subject<any>();

  constructor(private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  updateMyEvents(value: any) {
    this.myEvents.next({ status: value });
  }
  getMyEvents(): Observable<any> {
    return this.myEvents.asObservable();
  }
  updateUpcomingEvents(value: any) {
    this.upcomingEvents.next({ status: value });
  }
  getUpcomingEvents(): Observable<any> {
    return this.upcomingEvents.asObservable();
  }

  updateLifepopupStatus(value: boolean) {
    this.lifepopupsubject.next({ status: value });
  }
  getLifePopupStatus(): Observable<any> {
    return this.lifepopupsubject.asObservable();
  }
  updateReminderpopupCancelStatus(value: boolean) {
    this.reminderpopupsubject.next({ status: value });
  }
  getReminderPopupCancelStatus(): Observable<any> {
    return this.reminderpopupsubject.asObservable();
  }
  updateLoaderStatus(value: boolean) {
    this.loaderSubject.next({ status: value });
  }
  getLoaderStatus(): Observable<any> {
    return this.loaderSubject.asObservable();
  }
  updateHomeLoaderStatus(value: boolean) {
    this.homeLoader.next({ status: value });
  }
  getHomeLoaderStatus(): Observable<any> {
    return this.homeLoader.asObservable();
  }
  updateiframVisibility(value: boolean) {
    this.iframVisibility.next({ status: value });
  }
  getiframVisibility(): Observable<any> {
    return this.iframVisibility.asObservable();
  }

  updateWinStatus(value: boolean) {
    this.gameWon.next({ status: value });
  }
  getWinStatus(): Observable<any> {
    return this.gameWon.asObservable();
  }
  updateLostStatus(value: boolean) {
    this.gameLost.next({ status: value });
  }
  getLostStatus(): Observable<any> {
    return this.gameLost.asObservable();
  }
  updateGameEndStatus(value: any) {
    this.gameEnd.next({ status: value });
  }
  getGameEndStatus(): Observable<any> {
    return this.gameEnd.asObservable();
  }
  updateParticipantsCount(value: any) {
    this.participants.next({ status: value });
  }
  getParticipantsCount(): Observable<any> {
    return this.participants.asObservable();
  }
  // updateGameEndText(value: any) {
  //   this.gameEndText.next({ status: value });
  // }
  // getGameEndText(): Observable<any> {
  //   return this.gameEndText.asObservable();
  // }


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
  walletWithdraw(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/wallet-request', obj);
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
  showSuccessToast(successMessage: any, successitle: any) {
    this.toastr.success(successMessage, successitle);
  }
  showErrorToast(errorMessage: any, errorTitle: any) {
    this.toastr.error(errorMessage, errorTitle);
  }
  winEvent(obj: any) {
    return this.httpClient.post(this.baseUrl + '/api/game-events/win-event', obj);
  }
}

