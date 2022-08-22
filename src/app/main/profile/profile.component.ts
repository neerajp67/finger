import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  userName: any = '';
  userEmail: any = '';
  profilePicUrl: any = '../../../assets/icons/defaultProfilePic.png';
  profileForm!: FormGroup;
  profilePic!: File;

  constructor(private route: Router, private objService: FingerService,
    private formBuilder: FormBuilder,
    private prefService: PrefrenceService) { }

  ngOnInit(): void {
    // this.getProfile();
    this.prefService.getStorage('user').then(user => {
      if (user != null || user != '') {
        this.userDetails = JSON.parse(user);
        this.userName = this.userDetails.name;
        this.userEmail = this.userDetails.email;
        if (this.userDetails.avatar != null) {
          this.profilePicUrl = this.objService.baseUrl + '/storage/' + this.userDetails.avatar;
        } else {
          this.profilePicUrl = "../../../assets/icons/defaultProfilePic.png";
        }
      } else{
        this.getProfile();
      }
    });
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
  getProfile() {
    console.log();
    this.objService.getProfile().subscribe((data: any) => {
      console.log(data);
      this.userName = data.name;
      this.userEmail = data.email;
      if (data.avatar != null) {
        this.profilePicUrl = this.objService.baseUrl + '/storage/' + data.avatar;
      } else {
        this.profilePicUrl = "../../../assets/icons/defaultProfilePic.png";
      }
      // this.route.navigate(['main']);
    },
      (error: any) => {
        console.log(error);
      })
  }
  navigate(component: any) {
    this.route.navigate([component]);
  }
  onChange(event: any) {
    var filetype = event.target.accept
    var filetype = filetype.split(',')
    this.profilePic = event.target.files.item(0) // .name
    this.profilePicUrl = URL.createObjectURL(this.profilePic);
  }
  updateProfile(form: FormGroup) {
    const formData = new FormData();
    formData.append('avatar', this.profilePic);
    formData.append('name', form.value.name);
    console.log(formData);
    this.objService.updateProfile(formData).subscribe((data: any) => {
      console.log(data);
      this.userName = data.name;
      this.userEmail = data.email;
      this.profilePicUrl = this.objService.baseUrl + '/storage/' + data.avatar;
      this.objService.showSuccessToast('Profile updated', '');
      // this.route.navigate(['main']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
      })
  }
  getProfilePic() {
    let element: HTMLElement = document.getElementById('importProfile') as HTMLElement;
    let event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }
}
