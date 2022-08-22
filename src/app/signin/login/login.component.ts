import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// import * as firebase from 'firebase';

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
    private prefService: PrefrenceService) {
    var authToken = localStorage.getItem('authToken');
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
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  navigateToRegister() {
    this.route.navigate(['register']);
  }
  signInWithGoogle() {
    // const result = FirebaseAuthentication.signInWithGoogle();
    // return result.user
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
      device_id: '123', device_type: 'android', device_token: '123'
    }).subscribe((data: any) => {
      console.log(data);
      this.objService.showSuccessToast("Logged in successfully", '');
      this.prefService.setName('authToken', data.token);
      localStorage.setItem('authToken', data.token);
      this.route.navigate(['home']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
        // alert(error.error.message);
        this.objService.showErrorToast(error.error.message, '');
        // this.route.navigate(['register']);
      })
  }
  firebaseLogin(user: any) {
    console.log(user);
    this.objService.firebaseLogin({
      email: user.email, firebase_id: user.id,
      device_id: '123', device_type: 'android', device_token: '123'
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
