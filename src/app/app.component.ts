import { Component } from '@angular/core';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FingerGame';
  constructor() { }

  ngOnInit(): void {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        if (window.location.href == 'http://localhost:4200/main') {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      }
    });
  }

}
