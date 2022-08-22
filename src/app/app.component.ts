import { Component } from '@angular/core';
import { App as CapacitorApp } from '@capacitor/app';
import { FingerService } from './utils/finger.service';
import { FirebaseService } from './utils/firebase.service';
import { PrefrenceService } from './utils/prefrence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FingerGame';
  constructor(private objService: FingerService, 
    private firebaseService: FirebaseService,
    private prefService: PrefrenceService) { }

  ngOnInit(): void {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
        this.prefService.myEventdata = [];
        this.prefService.upcomingEventData = [];
      } else {
        if (window.location.href == 'http://localhost:4200/main') {
          CapacitorApp.exitApp();
          this.prefService.myEventdata = [];
        this.prefService.upcomingEventData = [];
        } else {
          window.history.back();
          // this.objService.showToast("backbutton");
        }
      }
    });
    this.firebaseService.registerNotifications();
    this.firebaseService.getDeliveredNotifications();
  }

}
