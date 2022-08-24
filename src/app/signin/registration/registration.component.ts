import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  // socialUser!: SocialUser;
  isLoggedin?: boolean;
  termComditionChecked: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private objService: FingerService,
    private prefService: PrefrenceService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required]
    });
  }
  // async signInWithFacebook(){
  //   const result = await FirebaseAuthentication.signInWithFacebook();
  //   return result.user;
  // }

  signInWithGoogle(): void {
    // this.objService.signInWithGoogle();
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signInWithFacebook(): void {
    // this.objService.signInWithFacebook();
    // this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  navigateToLogin() {
    console.log("back button clicked");
    this.route.navigate(['']);
  }

  openPrivacyPolicy() {
    console.log("Privacy policy clicked");
  }
  privacyPolicyCheck() {
    console.log("Privacy policy check clicked");
  }
  // name: ['', Validators.required],
  //     email: ['', Validators.required],
  //     password: ['', Validators.required],
  //     password_confirm: ['', Validators.required]
  registerUser(form: FormGroup) {
    if (form.value.name == "") {
      // alert("please enter name");
      this.objService.showErrorToast("Please enter name", '');
      return;
    } else if (form.value.email == "") {
      // alert("please enter email");
      this.objService.showErrorToast("Please enter email", '');
      return;
    } else if (form.value.phone == "" || form.value.phone.length != 10) {
      // alert("please enter email");
      this.objService.showErrorToast("Please enter valid phone", '');
      return;
    } else if (form.value.password == "") {
      // alert("please enter password");
      this.objService.showErrorToast("Please enter password", '');
      return;
    } else if (form.value.password_confirm == "") {
      // alert("please confirm password");
      this.objService.showErrorToast("Please confirm passwor", '');
      return;
    } else if (form.value.password !== form.value.password_confirm) {
      // alert("Password does not match");
      this.objService.showErrorToast("Password does not match", '');
      return;
    }
    this.objService.register({
      name: form.value.name, email: form.value.email, mobile: form.value.phone, 
      password: form.value.password,
      password_confirmation: form.value.password_confirm, firebase_id: form.value.password, device_id: '1234', device_type: 'android', device_token: '1234'
    }).subscribe((data: any) => {
      console.log(data);
      // localStorage.setItem('authToken', data.token);
      this.prefService.setName('authToken', data.token);
      this.objService.showSuccessToast("Registered Successfully", '');
      this.route.navigate(['home']);
      // this.route.navigate(['slider']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
        this.objService.showErrorToast(error.error.message, '');
      })
  }
}
