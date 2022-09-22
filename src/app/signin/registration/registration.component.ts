import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';
import { FirebaseService } from 'src/app/utils/firebase.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  termComditionChecked: boolean = false;
  user: any = null;
  fbToken: any;

  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private objService: FingerService,
    private prefService: PrefrenceService,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService) {
    this.initializeApp();
  }
  initializeApp() {
    GoogleAuth.initialize();
    FacebookLogin.initialize({ appId: '860095054976730' });
  }
  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required]
    });

    this.activatedRoute.queryParams.subscribe(data => {
      if (data['email'] != undefined) {
        this.user = data
      }
    }

      // console.log(JSON.parse(data))
    );
  }
  // async signInWithFacebook(){
  //   const result = await FirebaseAuthentication.signInWithFacebook();
  //   return result.user;
  // }

  async signInWithGoogle() {
    this.user = await GoogleAuth.signIn();
    console.log('User: ', this.user);
  }
  async signInWithFacebook() {
    // this.objService.updateLoaderStatus(true);
    const FACEBOOK_PERMISSIONS = [
      'email',
      'user_birthday',
      'user_photos',
      'user_gender',
    ];
    const result = await ((
      FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    ));

    // if (result.accessToken && result.accessToken.userId) {
    //   this.fbToken = result.accessToken;
    //   console.log(`Face  book access token is ${result.accessToken}`);
    //   this.getFbProfile();
    // } 
    // else if (result.accessToken && !result.accessToken.userId) {
    //   this.getCurentToken();
    // } 
    if (result.accessToken) {
      this.fbToken = result.accessToken;
      console.log(`Facebook access token is ${result.accessToken}`);
      this.getFbProfile();
    }
    else {
      this.getCurentToken();
      console.log('login failed');
    }
  }
  async getCurentToken() {
    const result = await FacebookLogin.getCurrentAccessToken();
    if (result.accessToken) {
      this.fbToken = result.accessToken;
      this.getFbProfile();
    } else {
      console.log('login faild, no access token')
    }
  }
  async getFbProfile() {
    const result = await FacebookLogin.getProfile({ fields: ['email', 'name', 'id'] });
    this.user = result;
  }

  navigateToLogin() {
    this.route.navigate(['login']);
  }

  openPrivacyPolicy() {
    console.log("Privacy policy clicked");
  }
  privacyPolicyCheck() {
    console.log("Privacy policy check clicked");
  }
  registerUser(form: FormGroup) {
    if (form.value.name == "") {
      this.objService.showErrorToast("Please enter name", '');
      return;
    } else if (form.value.email == "") {
      this.objService.showErrorToast("Please enter email", '');
      return;
    } else if (form.value.phone == "") {
      this.objService.showErrorToast("Please enter valid phone", '');
      return;
    } else if (form.value.phone.length != 11) {
      this.objService.showErrorToast("Please enter valid phone", '');
      return;
    } else if (form.value.password == "") {
      this.objService.showErrorToast("Please enter password", '');
      return;
    } else if (form.value.password_confirm == "") {
      this.objService.showErrorToast("Please confirm passwor", '');
      return;
    } else if (form.value.password !== form.value.password_confirm) {
      this.objService.showErrorToast("Password does not match", '');
      return;
    }
    this.objService.register({
      name: form.value.name, email: form.value.email, mobile: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.password_confirm, firebase_id: form.value.password,
      // device_id: '1234', 
      // device_type: 'android',
      //  device_token: '1234'
       device_id: this.firebaseService.deviceId,
      device_type: this.firebaseService.platform, 
      device_token: this.firebaseService.deviceToken
    }).subscribe((data: any) => {
      console.log(data);
      localStorage.setItem('authToken', data.token);
      this.prefService.setName('authToken', data.token);
      this.objService.showSuccessToast("Registered Successfully", '');
      this.route.navigate(['home']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
        this.objService.showErrorToast(error.error.message, '');
      })
  }
}
