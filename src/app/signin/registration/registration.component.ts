import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerService } from 'src/app/utils/finger.service';

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
    private objService: FingerService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required]
    });
  }

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
      alert("please enter name");
      return;
    } else if (form.value.email == "") {
      alert("please enter email");
      return;
    } else if (form.value.password == "") {
      alert("please enter password");
      return;
    } else if (form.value.password_confirm == "") {
      alert("please confirm password");
      return;
    } else if (form.value.password !== form.value.password_confirm) {
      alert("Password does not match");
      return;
    }
    this.objService.register({
      name: form.value.name, email: form.value.email, password: form.value.password,
      password_confirmation: form.value.password_confirm, firebase_id: form.value.password, device_id: '1234', device_type: 'android', device_token: '1234'
    }).subscribe((data: any) => {
      console.log(data);
      localStorage.setItem('authToken', data.token);
      this.route.navigate(['main']);
    },
      (error: any) => {
        console.log('error');
        console.log(error);
      })
  }
}
