import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';

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
    // private socialAuthService: SocialAuthService,
     private route: Router, 
    private objService: FingerService) {
      // var authTocken = localStorage.getItem('authToken');
      // if (authTocken != null || authTocken != '') {
      //   route.navigate(['main']);
      //   return;
      // }
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
  signInWithGoogle(): void {
    // this.objService.signInWithGoogle();
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signInWithFacebook(): void {
    // this.objService.signInWithFacebook();
    // this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    // this.objService.signOut();
  }

  login(form: FormGroup) {
    if(form.value.email == ""){
      alert("please enter email");
      return;
    } else if(form.value.password == ""){
      alert("please enter password")
      return;
    }
    this.objService.login({email: form.value.email, password: form.value.password, 
    device_id: '123', device_type: 'android', device_token: '123'}).subscribe((data: any) => {
      console.log(data);
      localStorage.setItem('authToken', data.token);
      this.route.navigate(['main']);
    },
    (error: any)=>{
      console.log('error');
      console.log(error);
      alert(error.message);
      // this.route.navigate(['register']);
    })
  }
  // firebaseLogin(user: any){
  //   console.log(user);
  //   this.objService.firebaseLogin({email: user.email, firebase_id: user.id, 
  //     device_id: '123', device_type: 'android', device_token: '123'}).subscribe((data: any) => {
  //       console.log(data);
  //       localStorage.setItem('authToken', data.token);
  //       this.route.navigate(['main']);
  //     },
  //     (error: any)=>{
  //       console.log('error');
  //       console.log(error);
  //     })
  // }

  forgetPassword(){
    console.log("forgetPassword clicked");
  }

}
