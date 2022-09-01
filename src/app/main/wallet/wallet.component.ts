import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaystackOptions } from 'angular4-paystack';
import { FingerService } from 'src/app/utils/finger.service';
import { PrefrenceService } from 'src/app/utils/prefrence.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  walletBalance: any;
  transactions: any[] = [];
  userDetails: any;
  authorizationUrl: any = '';

  paystackKey: any = environment.paystackKey;
  userEmail: any;
  addAmountValue: any = '';
  withdwarAmountValue: any = '';
  paystackReference: any;
  currency: any;
  addAmountBtn: boolean = false;

  constructor(private route: Router, private objService: FingerService,
    private prefService: PrefrenceService) { }

  ngOnInit(): void {
    var paystackData = localStorage.getItem('paystack');
    if (paystackData != null) {
      // this.paystackKey = JSON.parse(paystackData);
      var data = JSON.parse(paystackData);
      this.paystackKey = data.paystack_public_key;
      this.currency = data.currency;
    }
    this.paystackReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    // var user = localStorage.getItem('user');
    // if (user != null) {
    //   this.userDetails = JSON.parse(user);
    //   this.walletBalance = this.userDetails.wallet;
    //   this.userEmail = this.userDetails.email;
    // }
    this.prefService.getStorage('user').then(user => {
      if (user != null || user != '') {
        console.log('user');
        this.userDetails = JSON.parse(user);
        this.walletBalance = this.userDetails.wallet;
        this.userEmail = this.userDetails.email;
      }
    });
    this.getTransactions();

  }
  ngAfterViewInit(): void {

  }

  getTransactions() {
    this.objService.getTransactions().subscribe((data: any) => {
      console.log(data);
      this.transactions = data;
    },
      (error: any) => {
        console.log('error');
        console.log(error);
      })
  }
  navigate(component: any) {
    this.route.navigate([component]);
  }

  addAmount() {
    if (this.addAmountValue == "") {
      this.objService.showErrorToast("Enter a valid amount", '');
      return
    }
    this.paystackReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  withdrawAmount() {
    if (this.withdwarAmountValue == "" || this.withdwarAmountValue > this.walletBalance) {
      this.objService.showErrorToast("Enter a valid amount", '');
      return
    }
    // if(this.withdwarAmountValue > this.walletBalance){
    //   this.objService.showErrorToast("Enter a valid amount", '');
    // }
    this.objService.walletWithdraw({ amount: this.withdwarAmountValue }).subscribe(async (data: any) => {
      console.log(data);
      this.objService.showSuccessToast('Request send to admin', '')
      this.withdwarAmountValue = "";
      // this.getTransactions();
      // this.getProfile();
    },
      (error: any) => {
        console.log(error);
      })
    
    this.withdwarAmountValue = '';
  }

  paymentInit() {
    
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    console.log('Payment successfull', ref);
    this.objService.showSuccessToast('Payment successfull', '');
    this.objService.walletCredit({ amount: this.addAmountValue }).subscribe(async (data: any) => {
      console.log(data);
      // var accessCode = data.data.access_code;
      // this.authorizationUrl = data.data.authorization_url;
      // var reference = data.data.reference;
      this.addAmountValue = "";
      this.getTransactions();
      this.getProfile();
    },
      (error: any) => {
        console.log(error);
      })
  }

  paymentCancel() {
    console.log('Payment Failed');
    this.objService.showErrorToast('Payment Failed', '');
  }
  valuechange(event: any) {
    // console.log(event.target.value);
    this.addAmountValue = event.target.value
    if(this.addAmountValue < 3){
      this.addAmountBtn = false;
    } else {
      this.addAmountBtn = true;
    }
  }
  valueWithdrawchange(event: any) {
    // console.log(event.target.value);
    this.withdwarAmountValue = event.target.value
  }

  getProfile() {
    console.log();
    this.objService.getProfile().subscribe((data: any) => {
      console.log(data);
      this.walletBalance = data.wallet;
      this.userEmail = data.email;
    },
      (error: any) => {
        console.log(error);
      })
  }


}
