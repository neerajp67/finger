import { Component, OnInit } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { FingerService } from 'src/app/utils/finger.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  participants: any = 0;
  lifes: any = 0;
  walletAmount: any = 0;
  element!: HTMLElement;
  Pusher = Pusher;
  constructor(private objService: FingerService) { }

  ngOnInit(): void {
    var userId: any;
    this.objService.getProfile().subscribe((data: any) => {
      console.log(data);
      userId = data.id;
    },
      (error: any) => {
        console.log(error);
      })

    const echo = new Echo({
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
    echo.channel('App.Models.User.' + userId).listen(
      'notifications', (response: any) => {
      });

    echo.join('Event.').here((participants: any) =>
      this.participants = participants.length)
      .joining((participants: any) => this.participants++)
      .leaving((participants: any) => this.participants--);
  }
  ngAfterViewInit() {
    this.element = document.getElementById('gamePad') as HTMLElement;
    this.touchEventListner();
    console.log("participants: " + this.participants);
  }

  touchEventListner() {
    var rect = this.element.getBoundingClientRect();
    console.log("game pad coordinates")
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    this.element.addEventListener("touchstart", e => {
      console.log(e);
      console.log("start");
    })
    this.element.addEventListener("touchmove", e => {
      console.log("move");
    })
    this.element.addEventListener("touchend", e => {
      console.log("end");
    })

  }
  // mousedown() {
  //   let element: HTMLElement = document.getElementById('gamePad') as HTMLElement;
  //   var rect = element.getBoundingClientRect();

  //   console.log(rect.top, rect.right, rect.bottom, rect.left);
  //   console.log("mouse down")
  // }


}
