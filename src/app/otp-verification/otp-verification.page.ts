import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { SmsRetriever } from '@ionic-native/sms-retriever';
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
  OTP: any = '';
  public otpForm: FormGroup;
  type: any = '';
  @ViewChild('otp1') otp1;
  @ViewChild('otp6') otp6;
  maxTime: any = 30;
  timer: any;
  hidevalue: boolean;
  phone_number; any = '';
  constructor(public navParams: NavParams, private formBuilder: FormBuilder, private modalController: ModalController, public navCtrl: NavController, public api: PetcloudApiService) {
    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      otp5: ['', [Validators.required]],
      otp6: ['', [Validators.required]]
    });
    //, private smsRetriever: SmsRetriever this.smsRetriever.getAppHash()
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));
  }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.phone_number = this.navParams.get('phone_number');
    this.StartTimer();
    setTimeout(() => {
      this.otp1.setFocus();

    }, 100)
  }



  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      this.OTP = this.otpForm.value.otp1 + '' + this.otpForm.value.otp2 + '' + this.otpForm.value.otp3 + '' + this.otpForm.value.otp4 + '' + this.otpForm.value.otp5 + '' + this.otpForm.value.otp6
      console.log("enter", this.OTP);
      if (this.OTP.length > 0 && this.OTP.length == 6) {
        this.otp_verification();
      }
      // return 0;
    }
  }
  cancel() {
    this.modalController.dismiss();
  }
  otp_verification() {
    this.api.showLoader();
    var data = {
      'code': this.OTP
    }
    this.api.otpVerification(data).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      if (res.success) {
        console.log(this.type, "this.type");
        if (this.type == 'withdrawal' || this.type == 'direct_bank_payout') {
          this.api.showToast('Withdrawal Authorised!', 2000, 'bottom');
        } else if (this.type == 'add_money') {
          this.api.showToast('Top Up Authorised!', 2000, 'bottom');
        } else if (this.type == 'add_card') {
          this.api.showToast('Card Authorised!', 2000, 'bottom');
        } else if (this.type == 'basic-info') {
          this.api.showToast('Profile Authorised!', 2000, 'bottom');
        } else if (this.type == 'update_paypal') {
          this.api.showToast('Paypal details Authorised!', 2000, 'bottom');
        } else if (this.type == 'update_stripe') {
          this.api.showToast('Stripe details Authorised!', 2000, 'bottom');
        } else if (this.type == 'add_bank') {
          this.api.showToast('Bank Authorised!', 2000, 'bottom');
        } else {
          this.api.showToast('Top Up Authorised!', 2000, 'bottom');
        }
        this.redirection(this.OTP);
      } else {
        this.api.showToast(res.error, 2000, 'bottom');
        this.otp6.setFocus();
      }
    }, err => {
      this.api.autoLogout(err, "");
    })
  }
  redirection(otpVal) {
    console.log(otpVal)
    // if (this.type != 'add_money') {
    //   this.navCtrl.navigateForward(['/withdrawal']);
    // }
    var data = {
      type: this.type,
      code: otpVal
    }
    this.modalController.dismiss(data);
  }

  StartTimer() {
    this.timer = setTimeout(x => {
      if (this.maxTime <= 0) { }
      this.maxTime -= 1;
      if (this.maxTime > 0) {
        this.hidevalue = false;
        this.StartTimer();
      }
      else {
        this.hidevalue = true;
      }

    }, 1000);


  }
  resend() {
    this.api.showLoader();
    this.api.getOtp().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      console.log(res);
      if (res.success) {
        this.otp1.setFocus();
        this.hidevalue = true;
        this.maxTime = 30
        this.StartTimer();
        this.api.showToast(res.success, 2000, 'bottom');
      } else {
        this.api.showToast(res.error, 2000, 'bottom');
      }
    }, err => {
      this.api.autoLogout(err, "");
    })
    // this.navCtrl.navigateForward(['/withdrawal']);
    // this.modalController.dismiss();
  }
  // start() {
  //   this.smsRetriever.startWatching()
  //     .then((res: any) => {
  //       console.log(res);
  //       this.processSMS(res);
  //     })
  //     .catch((error: any) => console.error(error));
  // }
  // processSMS(data) {
  //   const message = data.Message;
  //   if (message != -1) {
  //     this.OTP = message.slice(0, 6);
  //     console.log(this.OTP);
  //     // this.OTPmessage = 'OTP received. Proceed to register';
  //     // this.presentToast('SMS received with correct app hash', 'bottom', 1500);
  //   }
  // }

}
