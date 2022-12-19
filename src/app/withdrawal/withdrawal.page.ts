import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { ModalController, NavController } from '@ionic/angular';
import { AddBankDetailPayoutComponent } from '../add-bank-detail-payout/add-bank-detail-payout.component';
import { Router } from '@angular/router';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})

export class WithdrawalPage implements OnInit {
  public withdraw: FormGroup;
  verify_code: any = '';
  constructor(private formBuilder: FormBuilder,
    public api: PetcloudApiService,
    public router: Router,
    public nav: NavController,
    public modelCntl: ModalController,
  ) { }

  ngOnInit() {
    this.withdraw = this.formBuilder.group({
      payout_source: ['paypal', [Validators.required]],
      amount: ['', [Validators.required]]
    });
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }

  async sendMoney() {
    if (this.withdraw.value.amount === 0) {
      this.api.showToast("Withdrawal amount cannot be 0", "3000", "bottom");
    } else if (parseInt(this.withdraw.value.amount) > parseInt(this.api.availableBalance)) {
      this.api.showToast("Insufficient amount, withdrawable available amount is $ " + this.api.availableBalance + " AUD", "3000", "bottom");
    } else {
      if (this.withdraw.value.payout_source == "bank") {
        const modal = await this.modelCntl.create({
          component: AddBankDetailPayoutComponent,
          animated: true,
          componentProps: {
            amount: this.withdraw.value.amount,
          },
        });
        modal.onDidDismiss().then((data: any) => {
          this.router.navigateByUrl('/home/tabs/profile-menu')
        });
        return await modal.present();
      } else {

        const formData = {
          WalletTransaction: {
            payout_source: this.withdraw.value.payout_source,
            amount: this.withdraw.value.amount,
            verify_code: this.verify_code
          }
        }
        this.api.showLoader();
        this.api.walletWithdraw(formData)
          .pipe(finalize(() => {
            this.api.hideLoader();
          })).subscribe((res: any) => {
            if (res.success) {
              this.api.showToast(res.message, '2000', 'bottom');
              this.router.navigateByUrl('/home/tabs/profile-menu')
            } else {
              this.api.showToast(res.error, '2000', 'bottom');
            }
          }, (err: any) => {
            this.api.autoLogout(err, formData)
            this.api.hideLoader();
          });
      }
    }

  }

  async goToVerification() {
    this.api.showLoader();
    this.api.getOtp().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      console.log(res);
      const modal = await this.modelCntl.create({
        component: OtpVerificationPage,
        animated: true,
        backdropDismiss: false,
        componentProps: {
          phone_number: res.phone_number,
          'type': 'withdrawal'
        }
      });
      modal.onDidDismiss()
        .then((data: any) => {
          console.log(data);
          this.verify_code = data.data.code;
          if (data.data.type == 'withdrawal') {
            this.sendMoney();
          }
        });
      return await modal.present();
    }, err => {
      this.api.autoLogout(err, "");
    })
    // this.nav.navigateForward(['/otp-verification'])
  }
}
