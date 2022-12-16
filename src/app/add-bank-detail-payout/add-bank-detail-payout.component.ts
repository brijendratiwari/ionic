import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';


@Component({
  selector: 'app-add-bank-detail-payout',
  templateUrl: './add-bank-detail-payout.component.html',
  styleUrls: ['./add-bank-detail-payout.component.scss'],
})
export class AddBankDetailPayoutComponent implements OnInit {
  public addBank: FormGroup;
  public accountNo: any
  public bankName: any;
  public recipient_id: any;
  public amt: any;
  public showBankForm: boolean = false;
  public isBankDetailShown: boolean = false;
  private addBankSubscription = new Subscription();
  constructor(private formBuilder: FormBuilder,
    private modelCntl: ModalController,
    public navParam: NavParams, private api: PetcloudApiService) {
    this.amt = this.navParam.get('amount');
  }

  ngOnInit() {

    this.addBank = this.formBuilder.group({
      accountName: ["", [Validators.required]],
      bsb: ["", [Validators.required]],
      accountNumber: ["", [Validators.required]],
      amount: [this.amt, [Validators.required]]
    });

    this.getLastBankPayout();
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }

  closeModal() {
    this.addBankSubscription.unsubscribe();
    this.modelCntl.dismiss();
  }
  async goToVerification(val) {
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
          'type': val
        }
      });
      modal.onDidDismiss()
        .then((data: any) => {
          console.log(data);
          if (data.data.type == 'add_bank') {
            this.addBankDetails(data.data.code);
          }
          if (data.data.type == 'direct_bank_payout') {
            this.transferNow(data.data.code);
          }
        });
      return await modal.present();
    }, err => {
      this.api.autoLogout(err, "");
    })
    // this.nav.navigateForward(['/otp-verification'])
  }
  addBankDetails(code) {
    const addBankForm = {
      amount: this.addBank.value.amount,
      verify_code: code,
      BankForm: {
        accountName: this.addBank.value.accountName,
        bsb: this.addBank.value.bsb,
        accountNumber: this.addBank.value.accountNumber
      }
    }

    this.api.showLoader();
    this.addBankSubscription.add(
      this.api.sendBankPayout(addBankForm).pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe((res: any) => {
        {
          if (res.status) {
            this.closeModal();
            this.api.showToast(res.message, 2000, 'bottom');
          } else {
            this.api.showToast(res.error, 2000, 'bottom');
          }
        }
      }, (err: any) => {
        this.closeModal();
        this.api.autoLogout(err, addBankForm);
      })
    )

  }

  toggleBankAccount() {
    this.showBankForm == true ? this.showBankForm = false : this.showBankForm = true;
  }

  transferNow(code) {
    const transferData = {
      amount: this.amt,
      verify_code: code,
    }
    this.api.showLoader();
    this.api.directBankPayout(transferData).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe((resp: any) => {
      if (resp.status) {
        this.api.showToast(resp.message, "3000", "bottom");
        this.closeModal();
      } else {
        this.api.showToast(resp.message, "3000", "bottom");
      }
    }, err => {
      this.api.autoLogout(err, transferData);
    })
  }

  getLastBankPayout() {
    this.api.showLoader();
    this.api.getRecentBank().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (resp: any) => {
      if (await resp.status) {
        if (resp.account) {
          this.accountNo = await resp.account.accountNumber;
          this.bankName = await resp.bank_name;
          this.isBankDetailShown = true

        } else {
          this.showBankForm = true;
          this.isBankDetailShown = false
        }
      } else {
        this.showBankForm = true;
      }
    }, err => {
      this.showBankForm = true;
      this.api.autoLogout(err, "");
    })
  }
}
