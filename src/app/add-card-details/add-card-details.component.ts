import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';

@Component({
  selector: 'app-add-card-details',
  templateUrl: './add-card-details.component.html',
  styleUrls: ['./add-card-details.component.scss'],
})
export class AddCardDetailsComponent implements OnInit {

  addCard: FormGroup;
  constructor(public model: ModalController,
    public api: PetcloudApiService,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.addCard = this.formBuilder.group({
      card_name: ['', [Validators.required]],
      card_number: [null, [Validators.required, Validators.maxLength(16)]],
      expiry_date: ['', [Validators.required]],
      cvv: [null, [Validators.required, Validators.maxLength(4)]],
      stripeDefault: [false]
    });
  }

  defaultCardChange(event) {
    event.detail.checked == false ? this.addCard.value.stripeDefault = "" :
      this.addCard.value.stripeDefault = 1
  }
  async goToVerification() {
    this.api.showLoader();
    this.api.getOtp().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      console.log(res);
      const modal = await this.model.create({
        component: OtpVerificationPage,
        animated: true,
        backdropDismiss: false,
        componentProps: {
          'phone_number': res.phone_number,
          'type': 'add_card'
        }
      });
      modal.onDidDismiss()
        .then((data: any) => {
          if (data.data.type == 'add_card') {
            this.addCardDetails(data.data.code);
          }
        });
      return await modal.present();
    }, err => {
      this.api.autoLogout(err, "");
    })
    // this.nav.navigateForward(['/otp-verification'])
  }
  addCardDetails(code) {
    this.api.showLoader();

    const addBankParams = {
      card_name: this.addCard.value.card_name,
      card_number: this.addCard.value.card_number,
      expiry_date: new DatePipe('en-US').transform(this.addCard.value.expiry_date, 'MM/y'),
      cvv: this.addCard.value.cvv,
      verify_code: code,
      stripeDefault: this.addCard.value.stripeDefault == false ||
        this.addCard.value.stripeDefault == "" ? "" : 1

    }
    this.api.addCardDetail(addBankParams)
      .pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe((res: any) => {
        if (res.status) {
          this.closeModal()
          this.api.showToast(res.message, '2000', 'bottom');
        } else {
          this.api.showToast(res.error, '2000', 'bottom');
        }
      }, (err: any) => {
        this.api.autoLogout(err, addBankParams)
        this.api.hideLoader();
        this.closeModal();
      });
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }


  closeModal() {

    this.model.dismiss();
  }
}
