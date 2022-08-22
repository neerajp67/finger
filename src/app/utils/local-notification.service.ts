import { Injectable } from '@angular/core';
import { LocalNotifications } from "@capacitor/local-notifications";

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  token: any = "";
  notification: any = null;
  notificationList: any = null;
  processing: any = false;
  constructor() { }

  async addLocalNotificationListeners() {
    await LocalNotifications.addListener("localNotificationReceived", (token: any) => {
      console.info("Registration token: ", token.value);
      this.token = token.value;
    });
    // await LocalNotifications.addListener("registrationError", (err) => {
    //   console.error("Registration error: ", err.error);
    // });

    // await LocalNotifications.addListener("pushNotificationReceived", (notification) => {
    //   console.log("Push notification received: ", notification);
    //   this.notification = notification;
    // });

    await LocalNotifications.addListener("localNotificationReceived", (notification: any) => {
      console.log("Push notification action performed", notification.actionId, notification.inputValue);
      this.notification = notification;
    });
  }
  async registerLocalNotifications() {
    let permStatus: any = await LocalNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      throw new Error("User denied permissions!");
    }

    await LocalNotifications.registerActionTypes(permStatus);
    this.addLocalNotificationListeners();
  }
  async getDeliveredNotifications() {
    this.notificationList = await LocalNotifications.getDeliveredNotifications();
    console.log("delivered notifications", this.notificationList);
  }
  async sendLocal(title: any, body: any, id: any) {
    LocalNotifications.schedule({
      notifications: [{
        title: title,
        body: body,
        id: id,
        // attachments: null,
        actionTypeId: "",
        extra: null,
        //sound:'beep.wav',
        // trigger: {
        //     at: new Date(Date.getTime() + (1000 * 1))
        // },
      }]
    })
  }
  async sendSoundLocal(title: any, body: any, id: any) {
    LocalNotifications.schedule({
      notifications: [{
        title: title,
        body: body,
        id: id,
        sound: 'aalert_tone.wav',
        // trigger: {
        //     at: new Date(Date.getTime() + (1000 * 1))
        // },
      }]
    })
  }
}
