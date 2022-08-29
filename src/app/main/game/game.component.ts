import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { FingerService } from 'src/app/utils/finger.service';
import { environment } from 'src/environments/environment';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { EchoService } from 'src/app/utils/echo.service';
import { Subscription, timeout } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  //new variables: 

  // for game pad events
  // allowTouchStart: boolean = false;
  // allowTouchMove: boolean = false;
  // allowTouchEnd: boolean = false;

  touchLocationX: any = 0;
  touchLocationY: any = 0;
  touchLocationMoveX: any = 1;
  touchLocationMoveY: any = 1;
  touchMovementInterval: any;
  gameToast: boolean = true;
  touchMoveCheck: boolean = false;

  // timmer/header text
  placeFingerTimer: boolean = false;
  gameNotStartedText: boolean = false;
  gameLostText: boolean = false;
  gameTimer: boolean = false;
  gameTimerHeading: any;

  // counts
  participantsCount: any;
  joinedParticipantCount: any;
  prizeMoney: any = 0;
  lifesCount: any = 0;

  lifeUsedCount: number = 0;
  lifeUsed: boolean = false;
  lifePopup: boolean = false;

  //game status
  startatTime: any;
  gameNotStarted: boolean = false;
  gameAboutToStart: boolean = false;
  gameStarted: boolean = false;
  gameLost: boolean = false;
  gameWon: boolean = false;
  gameWonPopUp: boolean = false;

  Pusher = Pusher;
  gameId: any;
  userId: any;
  currency: any;

  element!: HTMLElement;
  followFingerAnim!: HTMLElement;

  h1: any; h2: any; m1: any; m2: any; s1: any; s2: any;
  Ah1: any; Ah2: any; Am1: any; Am2: any; As1: any; As2: any;

  videoUrl: any;
  iframVisibility: boolean = false;
  subscription!: Subscription;

  wonSubscription!: Subscription;
  lostSubscription!: Subscription;
  placeFinger: boolean = false;
  enableAnimation: boolean = false;

  placeFingerOption: AnimationOptions = {
    path: '../../assets/inGameAnimation.json',
  };
  followFingerOption: AnimationOptions = {
    path: '../../assets/follow_finger_anim.json',
  };
  LifeUsedoptions: AnimationOptions = {
    path: '../../assets/lifeUsedAnimation.json',
  };

  css = window.document.styleSheets[0];


  constructor(private objService: FingerService, private route: ActivatedRoute,
    private router: Router, private echoService: EchoService) {
    this.css.insertRule(
      `@keyframes followFingerAnim {
          0%   {left:30%; top:40%;}
          10%   {left:60%; top:30%;}
          20%   {left:90%; top:50%;}
          30%   {left:50%; top:60%;}
          40%   {left:40%; top:20%;}
          50%  {left:20%; top:60%}
          60%  {left:80%; top:20%;}
          70%  {left:60%; top:70%;}
          80%  {left:30%; top:80%;}
          90%  {left:70%; top:60%;}
          100% {left:30%; top:40%;}
        }`, this.css.cssRules.length)
  }

  ngOnInit(): void {
    var paystackData = localStorage.getItem('paystack');
    if (paystackData != null) {
      var data = JSON.parse(paystackData);
      this.currency = data.currency;
    }
    // this.objService.updateiframVisibility(true);
    // this.participantsCount = this.echoService.participants;
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

    this.subscription = this.objService.getiframVisibility().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.iframVisibility = true;
      } else {
        this.iframVisibility = false;
      }
    });
    this.wonSubscription = this.objService.getWinStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.gameWon = true;
      } else {
        this.gameWon = false;
      }
    });
    this.lostSubscription = this.objService.getLostStatus().subscribe((value: any) => {
      if (Object.values(value)[0]) {
        this.gameLost = true;
      } else {
        this.gameLost = false;
      }
    });
  }
  ngAfterViewInit() {
    this.element = document.getElementById('gamePad') as HTMLElement;
    this.followFingerAnim = document.getElementById('followFinger') as HTMLElement;
    // this.followFingerAnim.style.animation = 'followFingerAnim 20s infinite'
    this.touchEventListner();

  }
  setToastTimmer() {
    var timeout = setTimeout(() => {
      this.gameToast = true;
      clearTimeout(timeout);
    }, 10000)
  }
  setTouchMoveTimmer() {
    var timeout = setTimeout(() => {
      this.touchMoveCheck = true;
      clearTimeout(timeout);
    }, 5000)
  }
  getEvent() {
    this.objService.getEvent({ game_event_id: this.gameId }).subscribe((data: any) => {
      console.log('my event');
      console.log(data);
      var enterAtTime = new Date(data.enter_at).getTime();
      this.startatTime = new Date(data.start_at).getTime();
      var startAtTime = new Date(data.start_at).getTime();
      var endAtTime = new Date(data.end_at).getTime();
      this.joinedParticipantCount = data.joined_participant;
      this.prizeMoney = data.prize
      if (data.url != null) {
        this.videoUrl = data.url;
        this.objService.updateiframVisibility(true);
      } else {
        this.objService.updateiframVisibility(true);
        this.videoUrl = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1'
      }
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
      this.lifesCount = data.life;
      this.joinEvent();
    },
      (error: any) => {
        console.log(error);
      })
  }
  joinEvent() {
    this.objService.joinEvent({ game_event_id: this.gameId, user_id: this.userId }).subscribe((data: any) => {
      console.log(data);
      if ((data.eliminated_at != null || data.disqualify_at != null) || data.life_use > 3) {
        this.gameLostText = true;
        this.gameNotStartedText = false;
        this.placeFingerTimer = false;

        // this.gameLost = true;
        this.objService.updateLostStatus(true);
        this.gameWon = false;
        this.gameWonPopUp = false;
        this.gameAboutToStart = false;
        this.gameStarted = false;
        this.gameNotStarted = false;
      }
      if (data.win_at != null) {
        //win
        // this.lifePopup = false;
        this.gameWon = true;
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = false;
        this.gameWonPopUp = true;
        //call win api
        this.winEvent();
        return;
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
      e.preventDefault();
      console.log('start');
      // this.checkUserMovement();
      if (this.gameLost) {
        if (this.gameToast) {
          this.objService.showErrorToast('You lost the game', '');
          this.gameToast = false;
          this.setToastTimmer();
        }
        return;
      }
      if (!this.gameStarted) {
        if (this.gameToast) {
          this.objService.showErrorToast('Game not started yet', '');
          this.gameToast = false;
          this.setToastTimmer();
        }
        return;
      }
      if (this.gameWon) {
        if (this.gameToast) {
          this.objService.showErrorToast('You Won the Game', '');
          this.gameToast = false;
          this.setToastTimmer();
        }
        return;
      }

      if (this.gameStarted && !this.lifeUsed) {
        this.echoService.echo.join('Event.' + this.gameId).here((participants: any) =>
          this.participantsCount = participants.length)
          .joining((participants: any) => this.participantsCount++)
          .leaving((participants: any) => this.participantsCount--);
        this.enterEvent(0);
        this.placeFinger = false;
        this.checkUserMovement();
        this.enableAnimation = true;
        this.followFingerAnim.style.animation = 'followFingerAnim 20s infinite'
      } else if (this.lifeUsed) {
        this.checkUserMovement();
        this.lifeUsed = false;
        this.enableAnimation = true;
        this.followFingerAnim.style.animation = 'followFingerAnim 20s infinite'
      }
    }),
    this.element.addEventListener("touchmove", e => {
      e.preventDefault();
      console.log('move')
      this.touchLocationMoveX = e.changedTouches[0].screenX;
      this.touchLocationMoveY = e.changedTouches[0].screenY;
      if (!this.gameStarted) {
        return;
      }
      if (this.gameLost || this.gameWon) {
        // clearInterval(this.touchMovementInterval);
        return;
      }

    }),
    this.element.addEventListener("touchend", e => {
      e.preventDefault();
      console.log("end");
      this.enableAnimation = false;
      // clearInterval(this.touchMovementInterval);
      if (!this.gameStarted || (this.gameWon || this.gameLost)) {
        return;
      }
      // this.echoService.echo.leave('Event.11');
      if (this.lifesCount >= 1 && this.lifeUsedCount < 4) {
        //  this.enterEvent();
        // if ((!this.gameWon && !this.gameLost) && this.participantsCount >= 1) {
        this.lifePopup = true;
        this.setTimmer();
        // }
      } else {
        this.enterEvent(0);
      }
    });
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
  checkUserMovement() {
    var touchMoveTimer = setTimeout(() => {
      if (this.touchLocationX != this.touchLocationMoveX || this.touchLocationY != this.touchLocationMoveY) {
        console.log('touch tracker');
        console.log(this.touchLocationX + ' ' + this.touchLocationY)
        console.log(this.touchLocationMoveX + ' ' + this.touchLocationMoveY)
        this.touchLocationX = this.touchLocationMoveX;
        this.touchLocationY = this.touchLocationMoveY;
        this.checkUserMovement();
      }
      else {
        console.log("same")
        if (!this.gameLost && !this.gameWon) {
          if (this.lifesCount >= 1 && this.lifeUsedCount < 4) {
            this.lifePopup = true;
            this.setTimmer();
            clearTimeout(touchMoveTimer);
          }
          else {
            clearTimeout(touchMoveTimer);
            this.enterEvent(0);
          }
        }
      }
    }, 5000);
  }
  enterEvent(life: any) {
    this.objService.enterEvent({ game_event_id: this.gameId, life: life }).subscribe((data: any) => {
      console.log(data);
      var currentTime = new Date().getTime();
      if (data.disqualify_at != null) {
        //loss
        // this.gameLost = true
        this.objService.updateLostStatus(true);
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = true;
        this.echoService.echo.leaveChannel('Event.' + this.gameId);
        return;
      }
      if (data.eliminated_at != null) {
        // this.gameLost = true
        this.objService.updateLostStatus(true);
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = true;
        // this.echoService.echo.leaveChannel('Event.' + this.gameId);
        return;
      }
      if (data.life_use >= 3) {
        //loss
        // this.gameLost = true
        this.objService.updateLostStatus(true);
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = true;
        this.echoService.echo.leaveChannel('Event.' + this.gameId);
        return;
      }
      if (data.win_at != null) {
        //win
        this.lifePopup = false;
        // this.gameWon = true;
        this.objService.updateWinStatus(true);
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = false;
        this.gameWonPopUp = true;
        this.winEvent();
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
      this.lifeUsed = true;
      this.enableAnimation = false;
      this.enterEvent(1);
      this.lifesCount--;
      this.lifeUsedCount++;
      this.lifePopup = false;
      var timeLeftLifeUsed: number = 6;
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
      if (timeDifference[0] != '-') {
        // this.placeFingerTimer = false;
        // this.gameNotStartedText = true;
        // this.gameLostText = false;
        // this.gameTimer = false;
        if (timeDifference[0] == '0' && timeDifference[1] == '0') {
          this.gameTimerHeading = 'Entry of event starts in'
          this.placeFingerTimer = true;
          this.gameNotStartedText = false;
          this.gameLostText = false;
          this.gameTimer = false;
          this.gameAboutToStart = false;
          this.gameNotStarted = false;
          this.m1 = timeDifference[3];
          this.m2 = timeDifference[4];
          this.s1 = timeDifference[6];
          this.s2 = timeDifference[7];
        }
        else {
          this.placeFingerTimer = false;
          this.gameNotStartedText = true;
          this.gameLostText = false;
          this.gameTimer = false;

          this.gameAboutToStart = false;
          this.gameNotStarted = true;
          // clearInterval(interval);
          // this.placeFingerTimer = false;
          // this.gameNotStartedText = false;
          // this.gameLostText = false;
          // this.gameTimer = false;
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
          this.gameTimerHeading = 'Time remaining to place finger'
          this.placeFingerTimer = true;
          this.gameNotStartedText = false;
          this.gameLostText = false;
          this.gameTimer = false;

          this.gameAboutToStart = true;
          this.gameNotStarted = false;
          this.m1 = timeDifference[3];
          this.m2 = timeDifference[4];
          this.s1 = timeDifference[6];
          this.s2 = timeDifference[7];
          if (timeDifference == '00:01:00') {
            this.placeFingerTimer = true;
            // this.gameNotStartedText = false;
            // this.gameLostText = false;
            this.gameTimer = false;
            this.gameStarted = true;
            // this.gameAboutToStart = false;
            this.gameNotStarted = false;
            this.placeFinger = true;
          } else if ((timeDifference[0] == '0' && timeDifference[1] == '0') &&
            (timeDifference[3] == '0' && parseInt(timeDifference[4]) == 0)) {
            this.placeFingerTimer = true;
            this.gameTimer = false;
            this.gameStarted = true;
            this.gameNotStarted = false;
            if (!this.enableAnimation) {
              this.placeFinger = true;
            } else {
              this.placeFinger = false;
            }
          }
        } else {
          //new timer
          var diffMilliseconds = currentTime - startAt;
          var diffSeconds = diffMilliseconds / 1000;
          var timeDifference = this.secondsToHMS(diffSeconds);
          this.Ah1 = timeDifference[0];
          this.Ah2 = timeDifference[1];
          this.Am1 = timeDifference[3];
          this.Am2 = timeDifference[4];
          this.As1 = timeDifference[6];
          this.As2 = timeDifference[7];
          this.placeFingerTimer = false;
          this.placeFinger = false;
          this.gameTimer = true;
          this.gameAboutToStart = false;
          if (this.gameWon) {
            this.gameStarted = false;
            this.enableAnimation = false;
            this.gameNotStarted = false;
            clearInterval(interval);
            this.winEvent();
          } else if (this.gameLost) {
            this.enableAnimation = false;
            this.gameStarted = false;
            this.gameNotStarted = false;
          } else {
            this.gameStarted = true;
          }
          // this.gameTimer = false;


          // var diffMilliseconds = endAt - currentTime;
          // var diffSeconds = diffMilliseconds / 1000;
          // var timeDifference = this.secondsToHMS(diffSeconds);
          // if (timeDifference[0] != '-') {


          // if (this.participants == 1 && (!this.gameLost || !this.gameWon)) {
          //   clearInterval(interval);
          //   this.gameAboutToStart = false;
          //   this.gameStarted = false;
          //   this.gameNotStarted = false;
          //   this.gameWon = true;
          //   this.gameLost = false;
          //   this.winEvent();
          // }


          // } 
          // else {
          //   clearInterval(interval);
          //   this.placeFinger = false;
          //   this.placeFingerTimer = false;
          //   this.enableAnimation = false;
          //   this.gameTimer = false;
          //   if (!this.gameLost) {
          //     this.winEvent();
          //   }
          //   this.gameAboutToStart = false;
          //   this.gameStarted = false;
          //   this.gameNotStarted = false;
          // }
        }
      }
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
  winEvent() {
    this.objService.winEvent({ game_event_id: this.gameId }).subscribe((data: any) => {
      console.log(data);
      // this.gameWon = true;
      this.objService.updateWinStatus(true);
      this.gameWonPopUp = true;
      // this.gameLost = false;
      this.objService.updateLostStatus(false);
      this.gameAboutToStart = false;
      this.gameStarted = false;
      this.gameNotStarted = false;
    },
      (error: any) => {
        console.log(error);
      })
  }
}
