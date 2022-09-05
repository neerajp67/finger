import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { FingerService } from './utils/finger.service';
import { FirebaseService } from './utils/firebase.service';
import { LocalNotificationService } from './utils/local-notification.service';
import { PrefrenceService } from './utils/prefrence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FingerGame';
  loader: boolean = false;
  homeLoader: boolean = false;
  subscriptionLifePopup!: Subscription;
  subscriptionReminderPopup!: Subscription;
  subscriptionLoader!: Subscription;
  subscriptionHomeLoader!: Subscription;
  lifePopup: boolean = false;
  reminderPopup: boolean = false;
  versionUpdateRequired: boolean = false;
  appUpdateLink: any;
  iframVisibility!: Subscription;
  iframe: boolean = false;
  loaderoptions: AnimationOptions = {
    path: '../assets/loaderAnim.json',
  };
  loaderoptionsHome: AnimationOptions = {
    path: '../assets/loaderAnim.json',
  };
  constructor(private objService: FingerService,
    private firebaseService: FirebaseService,
    private localNotification: LocalNotificationService,
    private prefService: PrefrenceService,
    private route: Router) {
    this.subscriptionLifePopup = this.objService.getLifePopupStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.lifePopup = true;
      } else {
        this.lifePopup = false;
      }
    });
    this.subscriptionReminderPopup = this.objService.getReminderPopupCancelStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.reminderPopup = true;
      } else {
        this.reminderPopup = false;
      }
    });
    this.subscriptionLoader = this.objService.getLoaderStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.loader = true;
      } else {
        this.loader = false;
      }
    });
    this.subscriptionHomeLoader = this.objService.getHomeLoaderStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.homeLoader = true;
      } else {
        this.homeLoader = false;
      }
    });
    this.iframVisibility = this.objService.getiframVisibility().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.iframe = true;
      } else {
        this.iframe = false;
      }
    });
  }

  ngOnInit(): void {
    this.appSetting();
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
        this.prefService.myEventdata = [];
        this.prefService.upcomingEventData = [];
      } else {
        if (window.location.href == `http://localhost:4200/home`) {
          if (this.lifePopup) {
            this.objService.updateLifepopupStatus(false);
            return;
          }
          if (this.reminderPopup) {
            this.objService.updateReminderpopupCancelStatus(true);
            return;
          }
          CapacitorApp.exitApp();
          this.prefService.myEventdata = [];
          this.prefService.upcomingEventData = [];
        } else if (window.location.href == 'http://localhost:4200/') {
          CapacitorApp.exitApp();
        } else if (this.iframe) {
          this.objService.updateiframVisibility(false);
          window.history.back();
          return;
        }
        window.history.back();
      }
    });
    this.localNotification.registerLocalNotifications();
    this.firebaseService.registerNotifications();
    this.firebaseService.getDeliveredNotifications();
  }

  appSetting() {
    this.objService.getSetting().subscribe((data: any) => {
      console.log(data);
      CapacitorApp.getInfo().then((value: any) => {
        if (value.version != data.app_version) {
          this.appUpdateLink = value.app_store_link;
          this.versionUpdateRequired = true;
        }
      });


      // async function getDeviceInfo() {
      //   const info = await CapacitorApp.getInfo();
      //   console.log(info);
      //   console.log(JSON.stringify(info));
      //   alert(JSON.stringify(info));
      // }
      localStorage.setItem('paystack', JSON.stringify(data));
    },
      (error: any) => {
        console.log(error);
      })
  }

  updateApp() {
    window.open(this.appUpdateLink, '_newtab');
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
