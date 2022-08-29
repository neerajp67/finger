import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { FingerService } from './finger.service';
import { LocalNotificationService } from './local-notification.service';
@Injectable({
  providedIn: 'root'
})
export class EchoService {
  // Pusher = Pusher;
echo: any;
participants: any = 0;
  constructor(private objService: FingerService,
    private localNotification: LocalNotificationService) {
  }
  initializeEcho(userId: any) {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.PUSHER_APP_KEY,
      wsHost: environment.wsHost,
      wsPort: 443,
      disableStarts: true,
      enableTransports: ['ws', 'wss'],
      forceTLS: false,
      encrypted: true,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: any, callback: any) => {
            this.objService.authorizer({
              socket_id: socketId,
              channel_name: channel.name
            }).subscribe((data: any) => {
              console.log(data);
              console.log("auth");
              callback(false, data);
            },
              (error: any) => {
                callback(true, error);
                console.log('error');
                console.log(error);
              })

          },
        };
      },
    });
    try {
      this.echo.private(`Game.User.` + userId).notification((valv: any) => {
        var arrSuccess = ['EVENT_ENTER', 'EVENT_WIN', 'EVENT_START', 'EVENT_JOIN'];
        // var gameStatus= ['EVENT_WIN', 'EVENT_LOSS'];
        console.log(valv);
        console.log(valv.title, valv.message);
        if(valv.key == 'EVENT_WIN'){
          this.objService.updateWinStatus(true);
          return
        }
        if(valv.key == 'EVENT_LOSS'){
          this.objService.updateLostStatus(true);
          return
        }
        if(arrSuccess.includes(valv.key)){
          this.localNotification.sendLocal(valv.title, valv.message, 1)
          // this.objService.showSuccessToast(valv.message, valv.title)
        } else{
          this.localNotification.sendLocal(valv.title, valv.message, 2)
          // this.objService.showErrorToast(valv.message, valv.title)
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  joinEcho(gameId: any) {
    this.echo.join('Event.' + gameId).here((participants: any) =>
      this.participants = participants.length)
      .joining((participants: any) => this.participants++)
      .leaving((participants: any) => this.participants--);
  }
}
