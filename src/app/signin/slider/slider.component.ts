import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FingerService } from 'src/app/utils/finger.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [NgbCarouselConfig]
})
export class SliderComponent implements OnInit {
  // images: any
  showNavigationArrows = true;
  showNavigationIndicators = false;
  images = ['../../../assets/images/sliderImg1.png',
    '../../../assets/images/sliderImg2.png',
    '../../../assets/images/sliderImg3.png'];
  ;
  sliderArr: any;
  constructor(config: NgbCarouselConfig,
    private route: Router,
    private objService: FingerService) {
    // config.interval = 2000;  
    // config.wrap = true;  
    // config.keyboard = false;  
    // config.pauseOnHover = false;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;

    // var authToken = localStorage.getItem('authToken');
    // if (authToken != null) {
    //   route.navigate(['home']);
    //   return;
    // }
    this.route.navigate(['login']);
  }


  ngOnInit(): void {
    this.appSetting();
    //   this.images = [
    //     {path: '../../../assets/images/sliderImg1.png'},
    //     {path: '../../../assets/images/sliderImg2.png'},
    //     {path: '../../../assets/images/sliderImg3.png'},
    // ]
  }
  appSetting() {
    this.objService.getSetting().subscribe((data: any) => {
      console.log(data);
      var sliderText = [{heading: [data.app_slider_title_1, data.app_slider_title_2,
        data.app_slider_title_3],
      subHeading: [data.app_slider_sub_1, data.app_slider_sub_2,
        data.app_slider_sub_3]}];
      this.sliderArr = sliderText;
    },
      (error: any) => {
        console.log(error);
      })
  }
  navigate(event: any) {
    this.route.navigate(['login']);
  }
}
