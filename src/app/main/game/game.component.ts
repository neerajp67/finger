import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { FingerService } from 'src/app/utils/finger.service';
import { environment } from 'src/environments/environment';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { EchoService } from 'src/app/utils/echo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  Pusher = Pusher;

  gameId: any;
  userId: any;
  participants: any = 0;
  lifes: any = 0;
  prizeMoney: any = 0;
  currency: any;

  element!: HTMLElement;

  placeFingerIn: any[] = [];
  h1: any; h2: any; m1: any; m2: any; s1: any; s2: any;
  Ah1: any; Ah2: any; Am1: any; Am2: any; As1: any; As2: any = 0;

  videoUrl: any;
  // iframVisibility: boolean = true;
  subscription!: Subscription;
  startatTime: any;
  gameAboutToStart: boolean = false;
  gameStarted: boolean = false;
  gameWon: boolean = false;
  gameLost: boolean = false;

  touchLocationX: any = 0;
  touchLocationy: any = 0;
  touchMovementInterval: any;

  lifePopup: boolean = false;
  lifeUsed: boolean = false;
  enableAnimation: boolean = false;
  options: AnimationOptions = {
    path: '../../assets/inGameAnimation.json',
  };
  LifeUsedoptions: AnimationOptions = {
    path: '../../assets/lifeUsedAnimation.json',
  };

  constructor(private objService: FingerService, private route: ActivatedRoute,
    private router: Router, private echoService: EchoService) { }

  ngOnInit(): void {
    var paystackData = localStorage.getItem('paystack');
    if (paystackData != null) {
      var data = JSON.parse(paystackData);
      this.currency = data.currency;
    }
    this.objService.updateiframVisibility(true);
    this.participants = this.echoService.participants;
    this.route.queryParams.subscribe(data =>
      this.gameId = Object.values(data)[0]
    );
    this.getEvent();
    this.getProfile();
    
    //todo call joinEvent api

    // this.echoService.echo.join('Event.' + this.gameId).here((participants: any) =>
    //   this.participants = participants.length)
    //   .joining((participants: any) => this.participants++)
    //   .leaving((participants: any) => this.participants--);

    // this.subscription = this.objService.getiframVisibility().subscribe((value: any) => {
    //   if (Object.values(value)[0]) {
    //     this.iframVisibility = true;
    //   } else {
    //     this.iframVisibility = false;
    //   }
    // });

  }
  ngAfterViewInit() {
    this.element = document.getElementById('gamePad') as HTMLElement;
    this.touchEventListner();
  }

  getEvent() {
    this.objService.getEvent({ game_event_id: this.gameId }).subscribe((data: any) => {
      console.log(data);
      var enterAtTime = new Date(data.enter_at).getTime();
      this.startatTime = new Date(data.start_at).getTime();
      var startAtTime = new Date(data.start_at).getTime();
      var endAtTime = new Date(data.end_at).getTime();
      this.videoUrl = data.url;
      this.prizeMoney = data.prize
      this.eventCounter(enterAtTime, startAtTime, endAtTime);
    },
      (error: any) => {
        console.log(error);
      })
  }
  getProfile() {
    this.objService.getProfile().subscribe((data: any) => {
      console.log(data);
      this.userId = data.id;
      this.lifes = data.life;
      // this.priceMoney = data.wallet;
      this.joinEvent();
    },
      (error: any) => {
        console.log(error);
      })
  }
  joinEvent() {
    this.objService.joinEvent({ game_event_id: this.gameId, user_id: this.userId }).subscribe((data: any) => {
      console.log(data);
      if ((data.eliminated_at != null || data.disqualify_at != null) || data.life_use >= 3) {
        this.gameLost = true;
        this.gameWon = false;
        this.gameAboutToStart = false;
        this.gameStarted = false;
      }
    },
      (error: any) => {
        console.log(error);
      })
  }

  touchEventListner() {
    var rect = this.element.getBoundingClientRect();
    console.log("game pad coordinates")
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    this.element.addEventListener("touchstart", e => {
      console.log(e);
      if(this.gameLost){
        this.objService.showErrorToast('You lost the game', '');
        return;
      }
      if (!this.gameStarted) {
        this.objService.showErrorToast('Game not started yet', '');
        return;
      }
      if (!this.gameLost) {
        this.echoService.echo.join('Event.' + this.gameId).here((participants: any) =>
          this.participants = participants.length)
          .joining((participants: any) => this.participants++)
          .leaving((participants: any) => this.participants--);
        this.enableAnimation = true;
      }
      if (!this.lifeUsed) {
        this.enterEvent(0);
      } else {
        this.lifeUsed = false;
      }
    })
    this.element.addEventListener("touchmove", e => {
      console.log("move");
      if (!this.gameStarted) {
        return;
      }
      console.log(e);
      if(this.gameLost || this.gameWon){
        clearInterval(this.touchMovementInterval);
      }
      this.touchMovementInterval = setInterval(() => {
        this.checkUserMovement(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
      }, 5000);

    })
    this.element.addEventListener("touchend", e => {
      console.log("end");
      clearInterval(this.touchMovementInterval);
      if (!this.gameStarted || (this.gameWon || this.gameLost)) {
        return;
      }
      // this.echoService.echo.leave('Event.11');
      this.enableAnimation = false;
      if (this.lifes >= 1) {
        //  this.enterEvent();
        if ((!this.gameWon || !this.gameLost) && this.participants >= 1) {
          this.lifePopup = true;
          this.setTimmer();
        }
      } else {
        this.enterEvent(0);
      }
    })
  }
  timeLeft: number = 5;
  setTimmer() {
    // var timeLeftinner: number = 5;
    this.timeLeft = 5;
    var interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // this.enterEvent(0);
        this.lifePopup = false;
        clearInterval(interval);
      }
    }, 1000)
  }
  checkUserMovement(x: any, y: any) {
    if (!this.touchLocationX == x && !this.touchLocationy == y) {
      this.touchLocationX = x;
      this.touchLocationy = y;
    } else {
      if(!this.gameLost && !this.gameWon)
      this.enterEvent(0);
    }
  }
  enterEvent(life: any) {
    this.objService.enterEvent({ game_event_id: this.gameId, life: life }).subscribe((data: any) => {
      console.log(data);
      var currentTime = new Date().getTime();
      // if (data.disqualify_at != null || data.eliminated_at != null) {
      //   this.echo.leaveChannel('App.Models.User.1');

      // }
      if (data.disqualify_at != null) {
        //loss
        this.gameLost = true
        this.enableAnimation = false;
        return;
      }
      if (data.eliminated_at != null) {
        this.gameLost = true
        this.enableAnimation = false;
        return;
      }
      if (data.life_use >= 3) {
        //loss
        this.gameLost = true
        this.enableAnimation = false;
        return;
      }
      if (data.win_at != null || this.participants == 1) {
        //win
        // this.lifePopup = false;
        this.gameWon = true;
        this.enableAnimation = false;
        return;
      }
    },
      (error: any) => {
        console.log(error);
      })
  }
  useLife(event: any) {
    if (event == 'no') {
      this.lifePopup = false;
      this.enterEvent(0);
    } else {
      this.enterEvent(1);
      this.lifes--;
      this.lifePopup = false;
      this.lifeUsed = true;
      var timeLeftLifeUsed: number = 5;
      var interval = setInterval(() => {
        if (timeLeftLifeUsed > 0) {
          timeLeftLifeUsed--;
        } else {
          if (this.lifeUsed) {
            this.enterEvent(0);
            this.lifeUsed = false;
          }
          clearInterval(interval);
        }
      }, 1000)
      // this.enterEvent();
    }
  }
  // mousedown() {
  //   let element: HTMLElement = document.getElementById('gamePad') as HTMLElement;
  //   var rect = element.getBoundingClientRect();

  //   console.log(rect.top, rect.right, rect.bottom, rect.left);
  //   console.log("mouse down")
  // }
  private getNowUTC() {
    const now = new Date();
    const time = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000)).getTime();
  }
  eventCounter(enterAt: any, startAt: any, endAt: any) {
    var interval = setInterval(() => {
      var currentTime = new Date().getTime();
      // const currentTime = this.getNowUTC();

      var diffMilliseconds = enterAt - currentTime;
      var diffSeconds = diffMilliseconds / 1000;
      var timeDifference = this.secondsToHMS(diffSeconds);
      // var h1, h2, m1, m2, s1, s2;
      if (timeDifference[0] != '-' && timeDifference[3] != ':') {
        if (timeDifference[0] == '0' && timeDifference[1] == '0') {
          this.gameAboutToStart = true;
          this.m1 = timeDifference[3];
          this.m2 = timeDifference[4];
          this.s1 = timeDifference[6];
          this.s2 = timeDifference[7];
        }
        else {
          this.gameAboutToStart = false;
          // clearInterval(interval);
        }
      } 
      // else if(timeDifference[0] == '-' || timeDifference[3] == ':'){
      //   this.gameAboutToStart = false;
      // } 
      else {
        var diffMilliseconds = startAt - currentTime;
        var diffSeconds = diffMilliseconds / 1000;
        var timeDifference = this.secondsToHMS(diffSeconds);
        if (timeDifference[0] != '-') {
          this.gameAboutToStart = true;
          this.m1 = timeDifference[3];
          this.m2 = timeDifference[4];
          this.s1 = timeDifference[6];
          this.s2 = timeDifference[7];
          if(timeDifference == '00:01:00'){
            this.gameStarted = true;
            this.gameAboutToStart = false;
          }
        } else {
          var diffMilliseconds = endAt - currentTime;
          var diffSeconds = diffMilliseconds / 1000;
          var timeDifference = this.secondsToHMS(diffSeconds);
          if (timeDifference[0] != '-') {
            if (this.participants == 1 && (!this.gameLost || !this.gameWon)) {
              // clearInterval(interval);
              // this.enterEvent(0);
              this.winEvent();
            }
            this.gameAboutToStart = false;
            this.gameStarted = true;
            this.Ah1 = timeDifference[0];
            this.Ah2 = timeDifference[1];
            this.Am1 = timeDifference[3];
            this.Am2 = timeDifference[4];
            this.As1 = timeDifference[6];
            this.As2 = timeDifference[7];
          } else {
            clearInterval(interval);
            if(!this.gameLost || !this.gameWon){
              this.enterEvent(0);
            }
            this.gameStarted = false;
          }
        }

      } 
      // else {
      //   this.gameAboutToStart = false;
      // }

      // if (timeDifference[0] == '-') {
      //   h1 = '0'
      //   h2 = '0'
      //   m1 = '0'
      //   m2 = '0'
      //   s1 = '0'
      //   s2 = '0'
      //   timer = { h1, h2, m1, m2, s1, s2 };
      //   this.eventStartTime.unshift(timer);
      //   this.eventStartTime.length = length;
      // } else {
      //   h1 = timeDifference[0]
      //   h2 = timeDifference[1]
      //   m1 = timeDifference[3]
      //   m2 = timeDifference[4]
      //   s1 = timeDifference[6]
      //   s2 = timeDifference[7]
      //   var timer = { h1, h2, m1, m2, s1, s2 };
      //   this.eventStartTime.unshift(timer);
      //   this.eventStartTime.length = length;
      // }
    }, 1000);
  }
  secondsToHMS(diffSeconds: any) {
    function z(n: any) { return (n < 10 ? '0' : '') + n; }
    var sign = diffSeconds < 0 ? '-' : '';
    diffSeconds = Math.abs(diffSeconds);
    return sign + z(diffSeconds / 3600 | 0) + ':' + z((diffSeconds % 3600) / 60 | 0) + ':' + z(diffSeconds % 60 | 0);
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  navigateToHome() {
    this.router.navigate(['home']);
  }
  winEvent(){
    this.objService.winEvent().subscribe((data: any) => {
      console.log(data);
      this.gameWon = true;
      this.gameLost = false;
    },
      (error: any) => {
        console.log(error);
      })
  }
}
