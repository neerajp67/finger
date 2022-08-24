import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from "@capacitor/device";
import { LocalNotificationService } from './local-notification.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  deviceToken: any;
  deviceId: any;
  notification: any;
  platform: any;
  notificationList: any;


  // deviceId: any;
  // deviceType: any;
  // deviceTocken: any;

  constructor(private localNotification: LocalNotificationService) { }

    // async dat() {
    //   await Device.getInfo()
    //     .then((result) => {
    //       var platform = result.platform;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   await Device.getId()
    //     .then((result) => {
    //       var deviceId = result;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }

  async addFirebaseListeners() {
    await PushNotifications.addListener("registration", (token) => {
      console.info("Registration token: ", token.value);
      this.deviceToken = token.value;
    });
    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error: ", err.error);
    });
    await PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push notification received: ", notification);
      this.notification = notification;
      console.log(JSON.stringify(notification));
      if (this.platform === "web") {
        const greeting = new Notification(notification.data.title, {
          body: notification.data.message,
        });
        setTimeout(() => greeting.close(), 10 * 1000);
      } else {
        this.localNotification.registerLocalNotifications();
        this.localNotification.sendLocal(notification.data.title, notification.data.message, 300);
      }
    });
    await PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      console.log("Push notification action performed", notification.actionId, notification.inputValue);
      this.notification = notification;
    });
  }
  async registerNotifications() {
    await Device.getInfo()
      .then((result) => {
        this.platform = result.platform;
      })
      .catch((err) => {
        console.log(err);
      });
      await Device.getId()
      .then((result) => {
        this.deviceId = result.uuid;
      })
      .catch((err) => {
        console.log(err);
      });
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
    this.addFirebaseListeners();
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  //local
  // async addLocalNotificationListeners() {
  //   // await LocalNotifications.addListener("localNotificationReceived", (token) => {
  //   //   // console.info("Registration token: ", token.value);
  //   //   // this.token = token.value;
  //   // });
  //   // addListener(eventName: 'localNotificationReceived', listenerFunc: 
  //   // (notification: LocalNotificationSchema) => void) => 
  //   // Promise<PluginListenerHandle> & PluginListenerHandle


  //   // await LocalNotifications.addListener("registrationError", (err) => {
  //   //   console.error("Registration error: ", err.error);
  //   // });

  //   await LocalNotifications.addListener("localNotificationReceived", (notification) => {
  //     console.log("Push notification received: ", notification);
  //     this.notification = notification;
  //   });

  //   await LocalNotifications.addListener("localNotificationActionPerformed", (notification) => {
  //     console.log("Push notification action performed", notification.actionId, notification.inputValue);
  //     this.notification = notification;
  //   });
  // }

  // async registerLocalNotifications() {
  //   let permStatus = await LocalNotifications.checkPermissions();

  //   // if (permStatus.receive === "prompt") {
  //   //   permStatus = await LocalNotifications.requestPermissions();
  //   // }

  //   // if (permStatus.receive !== "granted") {
  //   //   throw new Error("User denied permissions!");
  //   // }

  //   // await LocalNotifications.register();
  //   this.addLocalNotificationListeners();
  // }
  // // async getDeliveredNotifications() {
  // //   this.notificationList = await LocalNotifications.getDeliveredNotifications();
  // //   console.log("delivered notifications", notificationList);
  // // }
  // async sendLocal(title: any, body: any, id: any) {
  //   LocalNotifications.schedule({
  //     notifications: [{
  //       title: title,
  //       body: body,
  //       id: id,
  //       // attachments: null,
  //       actionTypeId: "",
  //       extra: null,
  //       //sound:'beep.wav',
  //       // trigger: {
  //       //     at: new Date(Date.getTime() + (1000 * 1))
  //       // },
  //     }]
  //   })
  // }

  // async sendSoundLocal(title: any, body: any, id: any) {
  //   LocalNotifications.schedule({
  //     notifications: [{
  //       title: title,
  //       body: body,
  //       id: id,
  //       sound: 'aalert_tone.wav',
  //       // trigger: {
  //       //     at: new Date(Date.getTime() + (1000 * 1))
  //       // },
  //     }]
  //   })
  // }


}
