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
  sliderArr: any;
  constructor(
    private route: Router,
    private objService: FingerService,
    ) {

    // var authToken = localStorage.getItem('authToken');
    // if (authToken != null) {
    //   route.navigate(['home']);
    //   return;
    // }
    // this.route.navigate(['login']);
  }


  ngOnInit(): void {
    this.appSetting();
  }
  appSetting() {
    this.objService.getSetting().subscribe((data: any) => {
      console.log(data);
      var sliderText = [{heading: [data.app_slider_title_1, data.app_slider_title_2,
        data.app_slider_title_3],
      subHeading: [data.app_slider_sub_1, data.app_slider_sub_2,
        data.app_slider_sub_3]}];
      this.sliderArr = sliderText;
      this.sliderImage = this.images[this.sliderId];
      this.sliderHeading = this.sliderArr[0].heading[this.sliderId];
      this.sliderSubHeading = this.sliderArr[0].subHeading[this.sliderId];
      this.objService.updateLoaderStatus(false);
    },
      (error: any) => {
        console.log(error);
      })
  }
  navigate(event: any) {
    this.route.navigate(['login']);
  }
  onNext(){
    if(this.sliderId <= 1){
      this.sliderImage = this.images[this.sliderId + 1];
      this.sliderHeading = this.sliderArr[0].heading[this.sliderId + 1];
      this.sliderSubHeading = this.sliderArr[0].subHeading[this.sliderId + 1];
    } else {
      this.route.navigate(['login']);
    }
    this.sliderId++;
  }
}
