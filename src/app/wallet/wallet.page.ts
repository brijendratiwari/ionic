import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { AuthorizationCongratsModelComponent } from '../authorization-congrats-model/authorization-congrats-model.component';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  giftCard: FormGroup
  slideOpts = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true
  };

  constructor(private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public nav: NavController,
    public api: PetcloudApiService) { }

  ngOnInit() {

    this.giftCard = this.formBuilder.group({
      coupon: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.checkFirstPromo();
  }

  addCouponCode() {

    const coupon = this.giftCard.value.coupon;

    const couponCode = {
      coupon
    }
    this.api.showLoader();
    this.api.addCouponCode(couponCode).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe((res: any) => {
      if (res.status) {
        this.api.showToast(res.message, "3000", "bottom")
        this.nav.pop()
      } else {
        this.api.showToast(res.message, "3000", "bottom")
      }
    }, err => {
      this.api.autoLogout(err, "");
    })
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }

  async checkFirstPromo() {
    this.api.checkfirstPromo()
      .pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe((res: any) => {
        if (res.status) {
          this.authorizationCongratsModel()
        }
      }, err => {
        this.api.autoLogout(err, "");
      })
  }


  async authorizationCongratsModel() {
    const modal = await this.modalCtrl.create({
      component: AuthorizationCongratsModelComponent,
      animated: true,
      cssClass: "modalCss",
      componentProps: {
      }

    });
    modal.onDidDismiss()
      .then((data: any) => {
        console.log(data);
      });
    return await modal.present();
  }


}
