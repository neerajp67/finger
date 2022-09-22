import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FirebaseService } from 'src/app/utils/firebase.service';
import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  email: String = '';
  user: any = null;
  fbToken: any;

  googleLoginOptions = {
    scope: 'profile email'
  };


  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private objService: FingerService,
    private prefService: PrefrenceService,
    private firebaseService: FirebaseService,
  ) {
    // var authToken = localStorage.getItem(',authToken');
    var authToken = localStorage.getItem('authToken');
    if (authToken != null) {
      route.navigate(['home']);
      return;
    }
    this.initializeApp();
    // if (authToken != null || authToken != '') {
    //   route.navigate(['main']);
    //   return;
    // }
    // this.prefService.getStorage('authToken').then(token => {
    //   var authToken = token
    //   if (authToken != null || authToken != '') {
    //     route.navigate(['main']);
    //     return;
    //   }
    // });
  }

  initializeApp() {
    GoogleAuth.initialize();
    FacebookLogin.initialize({ appId: '860095054976730' });
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  navigateToRegister() {
    this.route.navigate(['register']);
  }
  async signInWithGoogle() {
    this.user = await GoogleAuth.signIn();
    console.log('User: ', this.user);
    this.firebaseLogin(this.user);
  }

  async signInWithFacebook() {
    const FACEBOOK_PERMISSIONS = [
      'email',
      'user_birthday',
      'user_photos',
      'user_gender',
    ];
    const result = await ((
      FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    ));

    if (result.accessToken && result.accessToken.userId) {
      this.fbToken = result.accessToken;
      console.log(`Face  book access token is ${result.accessToken}`);
      this.getFbProfile();
    } else if (result.accessToken && !result.accessToken.userId) {
      this.getCurentToken();
    } else {
      console.log('login failed');
    }
  }

  async getCurentToken() {
    const result = await FacebookLogin.getCurrentAccessToken();
    if(result.accessToken){
      this.fbToken = result.accessToken;
      this.getFbProfile();
    } else {
      console.log('login faild, no access token')
    }
  }
  async getFbProfile(){
    const result = await FacebookLogin.getProfile({ fields: ['email', 'name', 'id'] });
    this.user = result;
    this.firebaseLogin(this.user);
  }
  signOut(): void {
  }

  login(form: FormGroup) {
    console.log("deviceInfo Login");
    console.log(this.firebaseService.deviceToken);
    console.log(this.firebaseService.platform);
    console.log(this.firebaseService.deviceId);
    if (form.value.email == "") {
      this.objService.showErrorToast("please enter email", "");
      return;
    } else if (form.value.password == "") {
      this.objService.showErrorToast("please enter password", "");
      return;
    }
    this.objService.login({
      email: form.value.email, password: form.value.password,
      // device_id: '123',
      device_id: this.firebaseService.deviceId,
      // device_type: this.firebaseService.platform, 
      // device_token: this.firebaseService.deviceToken,
      device_type: 'android',
      device_token: '123'
    }).subscribe((data: any) => {
      console.log(data);
      this.objService.showSuccessToast("Logged in successfully", '');
      this.prefService.setName('authToken', data.token);
      localStorage.setItem('authToken', data.token);
      this.route.navigate(['home']);
      // this.route.navigate(['slider']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
        // alert(error.error.message);
        this.objService.showErrorToast('', error.error.message);
        // this.route.navigate(['register']);
      })
  }
  firebaseLogin(user: any) {
    console.log(user);
    this.objService.firebaseLogin({
      email: user.email, firebase_id: user.id,
      device_id: this.firebaseService.deviceId,
      device_type: this.firebaseService.platform, 
      device_token: this.firebaseService.deviceToken
      // device_type: 'android',
      // device_token: '123'
    }).subscribe((data: any) => {
      console.log(data);
      localStorage.setItem('authToken', data.token);
      this.prefService.setName('authToken', data.token);
      this.objService.showSuccessToast("Logged in successfully", '');
      this.route.navigate(['home']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
        if(error.status == 422){
          // this.route.navigate(['register']);
          this.route.navigate(['register'], { queryParams: { name: user.name, email: user.email, id: user.id } });
        }
        this.objService.showErrorToast(error.error.message, '');
      })
  }

  forgetPassword() {
    console.log("forgetPassword clicked");
  }

}
