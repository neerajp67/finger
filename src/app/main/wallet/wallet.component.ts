import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaystackOptions } from 'angular4-paystack';
import { FingerService } from 'src/app/utils/finger.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  @ViewChild('addAmountInput')
  addAmountInput!: ElementRef;

  @ViewChild('withdrawdAmountInput')
  withdrawdAmountInput!: ElementRef;

  @ViewChild('addAmountBtn')
  addAmountBtn!: ElementRef;

  walletBalance: any;
  transactions: any[] = [];
  userDetails: any;
  authorizationUrl: any = '';

  paystackKey: any = environment.paystackKey;
  userEmail: any;
  addAmountValue: any;
  paystackReference: any;

  // [key]="'pk_test_34def31984d3b4c04ab3eda06561eed0b3ed1d0e'" 
  // [email]="'admin@dmin.com'"
  //     [amount]="0" [ref]="reference" 

  // options: PaystackOptions = {
  //   amount: 0,
  //   email: 'admin@admin.com',
  //   ref: `${Math.ceil(Math.random() * 10e10)}`,
  //   // currency: 'INR'
  // }


  constructor(private route: Router, private objService: FingerService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.paystackReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    var user = localStorage.getItem('user');
    console.log('user');
    if (user != null) {
      this.userDetails = JSON.parse(user);
      this.walletBalance = this.userDetails.wallet;
      this.userEmail = this.userDetails.email;
    }
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
    this.addAmountValue = this.addAmountInput.nativeElement.value;
    this.paystackReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    if (this.addAmountValue == "") {
      alert("Enter a valid amount");
      return
    }
    // this.objService.paystack({ amount: depositeAmount, email: this.userDetails.email }).subscribe(async (data: any) => {
    //   console.log(data);
    //   var accessCode = data.data.access_code;
    //   this.authorizationUrl = data.data.authorization_url;
    //   var reference = data.data.reference;
    // },
    //   (error: any) => {
    //     console.log(error);
    //   })
  }

  withdrawAmount() {
    var withdrawdAmount = this.withdrawdAmountInput.nativeElement.value;
    console.log("withdrawAmount clicked")
  }

  paymentInit() {
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.addAmountValue = "";
    this.addAmountInput.nativeElement.value = "";
    console.log('Payment successfull', ref);
  }

  paymentCancel() {
    console.log('payment failed');
  }
}
