import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
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
  subscription!: Subscription;
  lifePopup: boolean = false;
  versionUpdateRequired: boolean = false;
  appUpdateLink: any;
  constructor(private objService: FingerService,
    private firebaseService: FirebaseService,
    private localNotification: LocalNotificationService,
    private prefService: PrefrenceService,
    private route: Router) {
    this.subscription = this.objService.getLifePopupStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.lifePopup = true;
      } else {
        this.lifePopup = false;
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
        if (window.location.href == 'http://localhost:4200/home') {
          if (this.lifePopup) {
            this.objService.updateLifepopupStatus(false);
            return;
          }
          CapacitorApp.exitApp();
          this.prefService.myEventdata = [];
          this.prefService.upcomingEventData = [];
        }
        // else if (window.location.href == 'http://localhost:4200/null') {
        //   this.route.navigate(['home']);
        //   // window.location.href
        //   // this.objService.showToast("backbutton");
        // }
        else {
          window.history.back();
        }
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
        if(value.version != data.app_version){
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

  updateApp(){
    window.open(this.appUpdateLink,'_newtab');
  }

}
