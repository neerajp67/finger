import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbCarouselConfig, NgbPaginationNext, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { FingerService } from 'src/app/utils/finger.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [NgbCarouselConfig]
})
export class SliderComponent implements OnInit {

  // images: any
  sliderImage: any;
  sliderHeading: any;
  sliderSubHeading: any;
  sliderId: number = 0;
  images = ['../../../assets/images/sliderImg1.png',
    '../../../assets/images/sliderImg2.png',
    '../../../assets/images/sliderImg3.png'];
  ;
  sliderHeadingArr = ['',
    ' How to Play',
    'Tips on how to win:-'];
  ;
  sliderSubHeadingArr = ['Last Finger is a simple game that allows you to compete with others in a game of Last Finger on the app.',
    'Click join with your extra live and wait for the countdown to start Then place you finger and keep moving it around the screen until you are the last person on the app',
    'Make sure to buy extra lives so you can stand a better chance of winning'];
  ;
  sliderArr: any;
  constructor(
    private route: Router,
    private objService: FingerService,
  ) {
    this.sliderImage = this.images[0];
    this.sliderHeading = this.sliderHeadingArr[0];
    this.sliderSubHeading = this.sliderSubHeadingArr[0];
    var authToken = localStorage.getItem('authToken');
    if (authToken != null) {
      route.navigate(['home']);
      return;
    }
    // this.route.navigate(['login']);
  }

  ngOnInit(): void {

    this.appSetting();
  }
  appSetting() {
    this.objService.getSetting().subscribe((data: any) => {
      this.objService.updateLoaderStatus(false);
      console.log(data);
      var sliderText = [{
        heading: [data.app_slider_title_1, data.app_slider_title_2,
        data.app_slider_title_3],
        subHeading: [data.app_slider_sub_1, data.app_slider_sub_2,
        data.app_slider_sub_3]
      }];
      this.sliderArr = sliderText;
      // this.sliderImage = this.images[this.sliderId];
      // this.sliderHeading = this.sliderArr[0].heading[this.sliderId];
      // this.sliderSubHeading = this.sliderArr[0].subHeading[this.sliderId];

    },
      (error: any) => {
        console.log(error);
      })
  }
  navigate(event: any) {
    this.route.navigate(['login']);
  }
  onNext() {
    if (this.sliderId <= 1) {
      this.sliderImage = this.images[this.sliderId + 1];
      // this.sliderHeading = this.sliderArr[0].heading[this.sliderId + 1];
      // this.sliderSubHeading = this.sliderArr[0].subHeading[this.sliderId + 1];
      // this.sliderImage = this.images[0];
      this.sliderHeading = this.sliderHeadingArr[this.sliderId + 1];
      this.sliderSubHeading = this.sliderSubHeadingArr[this.sliderId + 1];
    } else {
      this.route.navigate(['login']);
    }
    this.sliderId++;
  }
}
