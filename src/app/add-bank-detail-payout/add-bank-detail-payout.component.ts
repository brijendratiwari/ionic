import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


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

  addBankDetails() {
    const addBankForm = {
      amount: this.addBank.value.amount,
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

  transferNow() {
    const transferData = {
      amount: this.amt,
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
