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
  touchMoveTimer: any;
  touchMoveLogger: Boolean = true;;
  // timmer/header text
  placeFingerTimer: boolean = false;
  gameNotStartedText: boolean = false;
  gameLostText: boolean = false;
  gameTimer: boolean = false;
  gameTimerHeading: any;
  gameEnd: boolean = false;

  // counts
  participantsCount: any;
  joinedParticipantCount: any;
  prizeMoney: any = 0;
  lifesCount: any = 0;

  lifeUsedCount: number = 0;
  lifeUsed: boolean = false;
  lifePopup: boolean = false;
  lifeUserCounter: any;

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
  gameEndSubscription!: Subscription;
  gameEndTextSubscription!: Subscription;
  participantsCountSubscription!: Subscription;
  gameEndText: any;

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

  callEnterEvent: boolean = true;


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
    // this.participantsCount = this.echoService.participants;
    this.route.queryParams.subscribe(data =>
      this.gameId = Object.values(data)[0]

    );
    this.getEvent();
    this.getProfile();

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
    this.gameEndSubscription = this.objService.getGameEndStatus().subscribe((value: any) => {
      if (value.status.eventId == this.gameId) {
        this.gameEnd = true;
        this.gameEndText = value.status.title + ', ' + value.status.message;
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 5000);
      } else {
        this.gameEnd = false;
      }
    });
    this.participantsCountSubscription = this.objService.getParticipantsCount().subscribe((value: any) => {
      if (value.status.gameId == this.gameId) {
        this.participantsCount = value.status.remaining_participant;
        if(this.participantsCount == 1 && !this.gameLost){
          setTimeout(() => {
            this.enterEvent(0);
          }, 1000);
        } else if(this.participantsCount == 1 && this.gameLost){
          setTimeout(() => {
            this.objService.updateGameEndStatus({ eventId: this.gameId, title: 'Event is Ended, ', message: 'try your luck next time' });
          }, 1000);
        }
        this.joinedParticipantCount = value.status.joined_participant
      }
    });
  }
  ngAfterViewInit() {
    this.element = document.getElementById('gamePad') as HTMLElement;
    this.followFingerAnim = document.getElementById('followFinger') as HTMLElement;
    // this.touchEventListner();

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
        // this.gameWon = true;
        this.objService.updateWinStatus(true);
        this.enableAnimation = false;
        this.gameNotStartedText = false;
        this.gameLostText = false;
        this.gameWonPopUp = true;
        //call win api
        // this.winEvent();
        return;
      }
    },
      (error: any) => {
        console.log(error);
      })
  }

  // touchEventListner() {
  //   var rect = this.element.getBoundingClientRect();
  //   console.log("game pad coordinates")
  //   console.log(rect.top, rect.right, rect.bottom, rect.left);

  //   this.element.addEventListener("touchstart", e => {
  //     const onTouchMove = () => {
  //       console.log('onTouchMove');
  //       this.touchLocationMoveX = e.changedTouches[0].screenX;
  //       this.touchLocationMoveY = e.changedTouches[0].screenY;
  //     }
  //     const onTouchEnd = () => {
  //       console.log('onToucEnd');
  //       this.element.removeEventListener('touchmove', onTouchMove);
  //       this.element.removeEventListener('touchend', onTouchEnd);
  //       this.enableAnimation = false;
  //       if (!this.gameStarted || (this.gameWon || this.gameLost)) {
  //         return;
  //       }
  //       if (this.lifesCount >= 1 && this.lifeUsedCount < 4) {
  //        if(!this.lifePopup){
  //          this.lifePopup = true;
  //          this.setTimmer();
  //        }
  //       } else {
  //         this.enterEvent(0);
  //       }
  //     }
  //     this.element.addEventListener('touchmove', onTouchMove);
  //     this.element.addEventListener('touchend', onTouchEnd);
  //     console.log('onTouchstart');
  //     if (this.gameLost) {
  //       if (this.gameToast) {
  //         this.objService.showErrorToast('You lost the game', '');
  //         this.gameToast = false;
  //         this.setToastTimmer();
  //       }
  //       return;
  //     }
  //     if (!this.gameStarted) {
  //       if (this.gameToast) {
  //         this.objService.showErrorToast('Game not started yet', '');
  //         this.gameToast = false;
  //         this.setToastTimmer();
  //       }
  //       return;
  //     }
  //     if (this.gameWon) {
  //       if (this.gameToast) {
  //         this.objService.showErrorToast('You Won the Game', '');
  //         this.gameToast = false;
  //         this.setToastTimmer();
  //       }
  //       return;
  //     }

  //     if (this.gameStarted && !this.lifeUsed) {
  //       this.echoService.echo.join('Event.' + this.gameId).here((participants: any) =>
  //         this.participantsCount = participants.length)
  //         .joining((participants: any) => this.participantsCount++)
  //         .leaving((participants: any) => this.participantsCount--);
  //       this.enterEvent(0);
  //       this.placeFinger = false;
  //       this.checkUserMovement();
  //       this.enableAnimation = true;
  //       this.followFingerAnim.style.animation = 'followFingerAnim 20s infinite'
  //     } else if (this.lifeUsed) {
  //       this.checkUserMovement();
  //       this.lifeUsed = false;
  //       this.enableAnimation = true;
  //       this.followFingerAnim.style.animation = 'followFingerAnim 20s infinite'
  //     }
  //   })
  // }
  timeLeft: number = 5;
  setTimmer() {
    console.log("user tife timer")
    this.timeLeft = 5;
    var interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if(this.lifePopup){
          this.lifePopup = false;
          this.enterEvent(0);
        }
        clearInterval(interval);
      }
    }, 1000)
  }
  checkUserMovement() {
    this.touchMoveTimer = setTimeout(() => {
      if (this.touchLocationX != this.touchLocationMoveX || this.touchLocationY != this.touchLocationMoveY) {
        console.log('touch different');
        console.log(this.touchLocationX + ' ' + this.touchLocationY)
        console.log(this.touchLocationMoveX + ' ' + this.touchLocationMoveY)
        this.touchLocationX = this.touchLocationMoveX;
        this.touchLocationY = this.touchLocationMoveY;
        if (this.gameWon) {
          clearTimeout(this.touchMoveTimer);
          return;
        }
        this.checkUserMovement();
      }
      else {
        console.log("touch same")
        if (!this.gameLost && !this.gameWon) {
          if (this.lifesCount >= 1 && this.lifeUsedCount < 3) {
            if (!this.lifePopup) {
              this.lifePopup = true;
              this.setTimmer();
            }
            clearTimeout(this.touchMoveTimer);
          }
          else {
            clearTimeout(this.touchMoveTimer);
            if (!this.gameWon) {
              this.enterEvent(0);
            }
          }
        }
      }
    }, 4000);
  }
  enterEvent(life: any) {
    if (this.callEnterEvent)
      this.objService.enterEvent({ game_event_id: this.gameId, life: life }).subscribe((data: any) => {
        console.log(data);
        console.log('enter Event')
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
          this.echoService.echo.leaveChannel('Event.' + this.gameId);
          return;
        }
        if (data.life_use > 4) {
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
          // this.winEvent();
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
      var timeLeftLifeUsed: number = 5;
      var interval = setInterval(() => {
        if (timeLeftLifeUsed > 0) {
          timeLeftLifeUsed--;
          this.lifeUserCounter = timeLeftLifeUsed;
        } else {
          if (this.lifeUsed) {
            this.enterEvent(0);
            this.lifeUsed = false;
          }
          this.lifeUserCounter = 5;
          clearInterval(interval);
        }
      }, 1000)
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
          if (timeDifference == '00:00:10') {
            this.placeFingerTimer = true;
            // this.gameNotStartedText = false;
            // this.gameLostText = false;
            this.gameTimer = false;
            this.gameStarted = true;
            // this.gameAboutToStart = false;
            this.gameNotStarted = false;
            this.placeFinger = true;
          } else if ((timeDifference[0] == '0' && timeDifference[1] == '0') &&
            (timeDifference[3] == '0' && parseInt(timeDifference[4]) == 0) &&
            (timeDifference[6] == '0' && parseInt(timeDifference[7]) <= 9)) {
            this.placeFingerTimer = true;
            this.gameTimer = false;
            this.gameStarted = true;
            this.gameNotStarted = false;
            if (!this.enableAnimation) {
              this.placeFinger = true;
            } else {
              this.placeFinger = false;
            }
            // if (this.gameWon) {
            //   this.gameStarted = false;
            //   this.enableAnimation = false;
            //   this.gameNotStarted = false;
            //   this.winEvent();
            //   clearInterval(interval);
            // }
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
          if (this.placeFingerTimer) {
            this.placeFingerTimer = false;
          }
          if (this.placeFinger) {
            this.placeFinger = false;
          }
          if (!this.gameTimer) {
            this.gameTimer = true;
          }
          if (this.gameAboutToStart) {
            this.gameAboutToStart = false;
          }
          if (this.gameWon) {
            this.gameStarted = false;
            this.enableAnimation = false;
            this.gameNotStarted = false;
            this.winEvent();
            clearInterval(interval);
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
      this.objService.updateLostStatus(true);
      this.gameAboutToStart = false;
      this.gameStarted = false;
      this.gameNotStarted = false;
    },
      (error: any) => {
        console.log(error);
      })
  }

  touchStartt(e: any) {
    e.preventDefault();
    console.log('start')
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
      .leaving((participants: any) => this.participantsCount--)
      .listen('participantRemaining', (value: any) => {
        console.log(value);
        console.log(value.id + ' ' + value.eventLog.remaining.remaining_participant);
        this.objService.updateParticipantsCount({
          gameId: value.id,
          remaining_participant: value.eventLog.remaining.remaining_participant,
          joined_participant: value.eventLog.remaining.joined_participant
        });
      });
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
  }
  touchMovee(e: any) {
    e.preventDefault();
    console.log('move')
    // if(this.touchMoveLogger){
      this.touchLocationMoveX = e.changedTouches[0].screenX;
      this.touchLocationMoveY = e.changedTouches[0].screenY;
    // }
    // if (!this.gameStarted) {
    //   return;
    // }
    // if (this.gameLost || this.gameWon) {
    //   clearInterval(this.touchMovementInterval);
    //   return;
    // }

    // })
  }
  touchEndd(e: any) {
    e.preventDefault();
    console.log('end')
    this.enableAnimation = false;
    clearTimeout(this.touchMoveTimer);
    if (!this.gameStarted || (this.gameWon || this.gameLost)) {
      return;
    }
    if (this.lifesCount >= 1 && this.lifeUsedCount < 3) {
      if (!this.lifePopup) {
        this.lifePopup = true;
        this.setTimmer();
      }
    } else {
      if (!this.gameWon) {
        this.enterEvent(0);
      }
    }
  }
}
