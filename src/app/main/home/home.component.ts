import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EchoService } from 'src/app/utils/echo.service';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  banners: any[] = [];
  userDetail: any[] = [];
  myEvents: any[] = [];
  eventStartTime: any[] = [];
  upcomingEventArray: any[] = [];
  walletAmount: any;
  life: any;
  lifePopup: boolean = false;
  life1: any = 0;
  life2: any = 1;
  lifeBuyCount: number = 1;
  lifePrice: any = 100;
  interval1: any;

  constructor(private route: Router, private objService: FingerService,
    private datePipe: DatePipe,
    private prefService: PrefrenceService,
    private echo: EchoService) { 

    }

  ngOnInit(): void {
    
    this.myEvents = this.prefService.myEventdata;
    this.upcomingEventArray = this.prefService.upcomingEventData;
    this.userDetail = this.prefService.profileData;
    this.getUserDetail();
    this.getEvents();
    this.setting();
    this.getMyEvents();
    // if (this.userDetail.length == 0) {
    //   this.getUserDetail();
    // }
    // if (this.upcomingEventArray.length == 0) {
    //   this.getEvents();
    // }
    // if (this.myEvents.length == 0) {
    //   this.getMyEvents();
    // } else {
    //   for (let i = this.myEvents.length - 1; i < this.myEvents.length; i--) {
    //     var startAtTime = new Date(this.myEvents[i].enter_at).getTime();
    //     this.eventCounter(startAtTime, this.myEvents.length);
    //   }
    // }
    // if(this.prefService.paystackData.length == 0){
    //   this.setting();
    // }
  }
  getUserDetail() {
    this.objService.getProfile().subscribe((data: any) => {
      console.log(data);
      this.prefService.profileData = data;
      this.walletAmount = data.wallet;
      this.life = data.life;
      this.userDetail = data;
      localStorage.setItem('user', JSON.stringify(data));
      this.prefService.setName('user', JSON.stringify(data));
      this.echo.initializeEcho(data.id);
    },
      (error: any) => {
        console.log(error);
      })
  }
  getMyEvents() {
    this.objService.myEvent().subscribe((data: any) => {
      console.log(data);
      this.myEvents = data;
      this.prefService.myEventdata = data;
      if (this.myEvents.length > 0) {
        for (let i = this.myEvents.length - 1; i < this.myEvents.length; i--) {
          var startAtTime = new Date(this.myEvents[i].enter_at).getTime();
          this.eventCounter(startAtTime, this.myEvents.length);
        }
      }
    },
      (error: any) => {
        console.log(error);
      })
  }
  getEvents() {
    this.objService.getEvents().subscribe((data: any) => {
      console.log(data);
      this.upcomingEventArray  = data;
      this.prefService.upcomingEventData = data;
    },
      (error: any) => {
        console.log(error);
      })
  }
  joinMainEvent(id: any) {
    // var user = this.prefService.checkName('user')
    var user = localStorage.getItem('user');
    var currnenyUser;
    console.log('user');
    if (user != null) {
      currnenyUser = JSON.parse(user);
    }
    this.objService.joinEvent({ game_event_id: id, user_id: currnenyUser.id }).subscribe((data: any) => {
      console.log(data);
      this.route.navigate(['game'], { queryParams: { data: data.game_event_id } });
    },
      (error: any) => {
        console.log(error);
      })
  }
  joinUpcomingEvent(id: any) {
    var user = localStorage.getItem('user');
    var currnenyUser;
    if (user != null) {
      currnenyUser = JSON.parse(user);
    }
    this.objService.joinEvent({ game_event_id: id, user_id: currnenyUser.id }).subscribe((data: any) => {
      console.log(data);
      this.getMyEvents();
    },
      (error: any) => {
        console.log(error);
      })
  }
  navigate(component: any) {
    this.route.navigate([component]);
  }

  coinContainer() {
    console.log("coinContainer clicked");
  }
  lifeContainer() {
    this.lifePopup = true;
    console.log("lifeContainer clicked");
  }
  changeLifeCount(event: any) {
    if (event == 'minus') {
      if (this.lifeBuyCount > 1) {
        this.lifeBuyCount--;
      }
    } else {
      this.lifeBuyCount++;
      // life1: any;
      // life2: any;
      // lifeBuyCount: any;
    }
    if (this.lifeBuyCount < 10) {
      this.life1 = 0;
      this.life2 = this.lifeBuyCount;
    } else {
      var a = "" + this.lifeBuyCount;
      this.life1 = a[0];
      this.life2 = a[1];
    }
    // this.lifePrice = 0;
    this.lifePrice = 100 * +this.lifeBuyCount;
  }
  buyLife() {
    this.objService.lifeCredit({ amount: this.lifePrice, life: this.lifeBuyCount }).subscribe((data: any) => {
      console.log(data);
      console.log("life credit")
      this.lifePopup = false;
      this.objService.showSuccessToast(data.message, '');
    },
      (error: any) => {
        console.log(error);
      })
  }
  logout() {
    // this.objService.logout().subscribe((data: any) => {
    //   console.log(data);
    // this.objService.signOut();
    // this.transformDate(data.start_at);
    // },
    //   (error: any) => {
    //     console.log(error);
    //   })
  }

  eventCounter(startAtTime: any, length: number) {
    this.interval1 = setInterval(() => {
      var currentTime = new Date().getTime();
      var diffMilliseconds = startAtTime - currentTime;
      var diffSeconds = diffMilliseconds / 1000;
      var timeDifference = this.secondsToHMS(diffSeconds);
      var h1, h2, m1, m2, s1, s2;
      if (timeDifference[0] == '-') {
        h1 = '0'
        h2 = '0'
        m1 = '0'
        m2 = '0'
        s1 = '0'
        s2 = '0'
        timer = { h1, h2, m1, m2, s1, s2 };
        this.eventStartTime.unshift(timer);
        this.eventStartTime.length = length;
      } else {
        h1 = timeDifference[0]
        h2 = timeDifference[1]
        m1 = timeDifference[3]
        m2 = timeDifference[4]
        s1 = timeDifference[6]
        s2 = timeDifference[7]
        var timer = { h1, h2, m1, m2, s1, s2 };
        this.eventStartTime.unshift(timer);
        this.eventStartTime.length = length;
      }
    }, 1000);
  }
  secondsToHMS(diffSeconds: any) {
    function z(n: any) { return (n < 10 ? '0' : '') + n; }
    var sign = diffSeconds < 0 ? '-' : '';
    diffSeconds = Math.abs(diffSeconds);
    return sign + z(diffSeconds / 3600 | 0) + ':' + z((diffSeconds % 3600) / 60 | 0) + ':' + z(diffSeconds % 60 | 0);
  }
  ngOnDestroy() {
    clearInterval(this.interval1);
  }
  setting() {
    this.objService.getSetting().subscribe((data: any) => {
      console.log(data);
      this.prefService.paystackData = data;
      localStorage.setItem('paystack', JSON.stringify(data));
    },
      (error: any) => {
        console.log(error);
      })
  }
}
