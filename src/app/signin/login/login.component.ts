import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// import * as firebase from 'firebase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FirebaseService } from 'src/app/utils/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // socialUser!: SocialUser;
  isLoggedin?: boolean;
  email: String = '';

  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private objService: FingerService,
    private prefService: PrefrenceService,
    private firebaseService: FirebaseService) {
    // var authToken = localStorage.getItem('authToken');
    var authToken = localStorage.getItem('authToken');
    if (authToken != null) {
      route.navigate(['home']);
      return;
    }
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



  ngOnInit(): void {
    // firebase.initializeApp(config);
    this.ionViewDidEnter(); 
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  navigateToRegister() {
    this.route.navigate(['register']);
  }
  // signInWithGoogle() {
  //   // const result = FirebaseAuthentication.signInWithGoogle();
  //   // return result.user
  // }
  async signInWithGoogle() {
    
    const user = await GoogleAuth.signIn();
    if (user) {
      console.log(user);
      this.firebaseLogin(user);
    }
  }
  ionViewDidEnter(){
    GoogleAuth.initialize();
  }
  // const signInWithGoogle = async () => {
  //   const result = await FirebaseAuthentication.signInWithGoogle();
  //   return result.user;
  // };

  signInWithFacebook(): void {
  }
  signOut(): void {
  }

  login(form: FormGroup) {
    console.log("deviceInfo Login");
    console.log(this.firebaseService.deviceToken);
    console.log(this.firebaseService.platform);
    console.log(this.firebaseService.deviceId);
    if (form.value.email == "") {
      // alert("please enter email");
      this.objService.showErrorToast("please enter email", "");
      return;
    } else if (form.value.password == "") {
      // alert("please enter password")
      this.objService.showErrorToast("please enter password", "");
      return;
    }
    this.objService.login({
      email: form.value.email, password: form.value.password,
      device_id: this.firebaseService.deviceId, 
      // device_type: this.firebaseService.platform, 
      // device_token: this.firebaseService.deviceToken
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
      device_id: this.firebaseService.deviceId , device_type: this.firebaseService.platform, 
      device_token: this.firebaseService.deviceToken
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
        this.objService.showErrorToast(error.error.message, '');
      })
  }

  forgetPassword() {
    console.log("forgetPassword clicked");
  }

}
