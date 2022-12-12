import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { User } from "../model/user";

import { finalize } from "rxjs/operators";
import { ApplePay } from "@ionic-native/apple-pay/ngx";
import { Platform, ModalController, AlertController, NavController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AddCardDetailsComponent } from "../add-card-details/add-card-details.component";
import { Router } from '@angular/router';
import { AnalyticsService } from '../analytics.service';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';



@Component({
  selector: "app-addmoney",
  templateUrl: "./addmoney.page.html",
  styleUrls: ["./addmoney.page.scss"],
})
export class AddmoneyPage implements OnInit {
  public addCredit = [
    {
      amount: "$50",
      css: false,
    },
    { amount: "$60", css: false },
    { amount: "$70", css: false },
    { amount: "$80", css: false },
    { amount: "$90", css: false },
    { amount: "$100", css: false },
    { amount: "$500", css: false },
    { amount: "Other", css: false },
  ];

  cards: any = [];
  promoCode: "";
  isActiveClass: boolean = false;
  public couponAmount = 0;

  public APPLE_PAY = "APPLE_PAY";
  public GPAY_PAY = "GPAY_PAY";
  public PAYPAL_PAY = "PAYPAL_PAY";

  public payableAmount = 0;
  public transactionalFees = 0;
  public creditAmount = 0;



  paypalProductionKey = "";
  paypalSandboxKey = "";
  auto_recharge: boolean = false;
  userId: any;
  public isOtherAmount: boolean = false;
  public addMoney: FormGroup;
  public promoCodeForm: FormGroup;

  supportedNetworks: any = ["visa", "amex"];
  merchantCapabilities: any = ["3ds", "debit", "credit"];
  merchantIdentifier: string = "merchant.apple.test";
  currencyCode: string = "AUD";
  countryCode: string = "AU";
  billingAddressRequirement: any = ["name", "email", "phone"];
  shippingAddressRequirement: any = "none";
  shippingType: string = "shipping";

  public isGiftCodeInput: boolean = false
  public promoType: any;
  constructor(
    private storage: Storage,
    private applePay: ApplePay,
    public analytics: AnalyticsService,
    private formBuilder: FormBuilder,
    private modelCntl: ModalController,
    public alertController: AlertController,
    private router: Router,
    public nav: NavController,
    private api: PetcloudApiService,
    public firebaseAnalytics: AnalyticsService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.promoCodeForm = this.formBuilder.group({
      giftvoucher: ["", [Validators.required]],
      amount: ["", [Validators.required]]
    });

    this.addMoney = this.formBuilder.group({
      userEditedAmount: ["0", [Validators.required]],
      selectAmount: [""],
      otherAmount: [""],
      default_card: [""],
      paymentGateway: ["", [Validators.required]],

    });
    this.getInfo();
  }

  ionViewWillEnter() {

    this.isGiftCodeInput = false;
    console.log("this.addMoney ", this.addMoney)
  }

  getSelectedPaymentMethod(event) {
  }

  onSelectedCredit(credit) {
    this.addCredit.forEach((data) => {
      data.amount == credit.amount ? (data.css = true) : (data.css = false);
    });

    credit.amount == "Other"
      ? (this.isOtherAmount = true)
      : (this.isOtherAmount = false);
    if (credit.amount != "Other") {
      this.creditAmount = credit.amount.replace("$", "");
      this.promoCodeForm.patchValue({
        amount: credit.amount.replace("$", "")
      });

      this.firebaseAnalytics.setUser();
      this.firebaseAnalytics.logEvent(PetcloudApiService.select_amount_analytics, { "amount": this.promoCodeForm.value.amount })
      this.firebaseAnalytics.setProperty(PetcloudApiService.select_amount_analytics, { "amount": this.promoCodeForm.value.amount })

      this.calculateTransactionalAmount(this.creditAmount);

      this.addMoney.patchValue({
        userEditedAmount: credit.amount.replace("$", ""),
        otherAmount: "",
      });

      this.promoCodeForm.patchValue({
        amount: credit.amount.replace("$", ""),
      })

    } else {
      this.creditAmount = 0;
      this.calculateTransactionalAmount(0);
      this.addMoney.patchValue({
        userEditedAmount: "0",
      });
    }
  }

  calculateTransactionalAmount(amount) {
    if (amount === 0) {
      this.transactionalFees = 0;
      this.payableAmount = 0;
    } else {
      this.transactionalFees = Number(((amount * 1.75) / 100 + 0.30).toFixed(2));
      this.payableAmount = parseInt(amount.toString()) + Number.parseFloat(this.transactionalFees.toString());
    }
  }

  onOtherAmount(event) {
    this.creditAmount = event;
    if (event != "") {
      this.calculateTransactionalAmount(this.creditAmount);
    } else {
      this.transactionalFees = 0;
      this.payableAmount = 0;
      this.creditAmount = 0;
    }

    this.addMoney.patchValue({
      userEditedAmount: event,
    });
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }


  public addCreditToPaypal() {

    this.api.showToast("We will release paypal payments in next version of App", "3000", "bottom");
  }

  addCreditAPI(amount, paymentId, source) {
    let addCreditParams = {

      amount,
      transaction_id: source == "paypal" ? paymentId : "",
      deposit_source: source,
      giftvoucher: this.isGiftCodeInput ? this.promoCodeForm.value.giftvoucher : "",
      coupon_status: this.isGiftCodeInput ? "valid" : "",
      card_id: this.addMoney.value.default_card
      // coupon: this.promoCode
    };


    this.api.showLoader();
    this.api
      .addCredits(addCreditParams).pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe(
        (res: any) => {
          {
            if (res.success) {
              this.api.showToast(res.message, 2000, "bottom");
              this.router.navigateByUrl('/home/tabs/profile-menu')
            } else {
              this.api.showToast(res.error, 2000, "bottom");
            }
          }
        },
        (err: any) => {
          this.api.autoLogout(err, addCreditParams);
        }
      );
  }

  getCardsList() {
    this.api
      .getCardList()
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          {
            if (res.status) {
              if (res.cards) {
                if (res.cards.data.length) {
                  this.cards = await res.cards.data;

                  this.cards.map((item: any) => {
                    item.css = false;
                  })


                  if (this.cards.length) {
                    this.selectedCard(this.cards[0]);
                  } else {
                    this.getSelectedPaymentMethod(1)
                  }
                }
              } else {
                this.getSelectedPaymentMethod(1)
              }
            } else {
              this.getSelectedPaymentMethod(1)
            }
          }
        },
        (err: any) => {
          this.api.autoLogout(err, "");
        }
      );
  }

  async removeCard(card_id, index) {
    const alert = await this.alertController.create({
      message: "Do you want to remove card?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Okay",
          handler: () => {
            this.cards.splice(index, 1);
            this.removeCardAPI(card_id);
          },
        },
      ],
    });
    await alert.present();
  }

  async removeCardAPI(card_id) {
    const cardParam = {
      card_id,
    };
    this.api.showLoader();
    this.api
      .deleteCard(cardParam)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          {
            if (res.status) {
              this.getCardsList();
            }
          }
        },
        (err: any) => {
          this.api.autoLogout(err, cardParam);
        }
      );
  }

  async makeDefaultCard(card_id) {

    const alert = await this.alertController.create({
      message: "Do you want to make default card?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",

        },
        {
          text: "Okay",
          handler: () => {
            this.makeDefaultCardAPI(card_id)
          },
        },
      ],
    });
    await alert.present();
  }

  selectedCard(card) {
    let cardId = card.id;

    this.addMoney.patchValue({
      default_card: cardId,
      paymentGateway: ""
    })

    if (this.addMoney.value.default_card != "") {
      this.addMoney.controls['paymentGateway'].setValidators([]);
      this.addMoney.controls['paymentGateway'].updateValueAndValidity();
    }

    this.cards.forEach(element => {
      if (element.id == card.id) {
        element.css = true;
      } else {
        element.css = false;
      }
    });
  }

  async makeDefaultCardAPI(card_id) {
    const cardParam = {
      card_id,
    };

    this.api.showLoader();
    this.api
      .makeDefaultCard(cardParam)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          {
            this.getCardsList();
          }
        },
        (err: any) => {
          this.api.autoLogout(err, cardParam);
        }
      );
  }

  addFunds() {

    if (this.creditAmount < 5) {
      this.api.showToast("Minimum amount wallet is $ 5 AUD", 3000, "bottom");
    }
    else {
      this.goToVerification()
      // let paymentGateWay = this.addMoney.value.paymentGateway;

      // this.addCreditAPI(this.creditAmount, "", "stripe")

    }
  }

  async addCardModel() {
    const modal = await this.modelCntl.create({
      component: AddCardDetailsComponent,
      animated: true,
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {
      this.getCardsList();
    });
    return await modal.present();
  }

  checkCoupon() {
    const data = {
      giftvoucher: this.promoCodeForm.value.giftvoucher,
      amount: this.addMoney.value.userEditedAmount
    }

    this.api.showLoader();
    this.api
      .checkCoupon(data)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          {
            if (res.status) {

              this.isGiftCodeInput = true;
              this.promoType = await res.promo_type;
              if (res.couponamount) {
                this.couponAmount = res.couponamount;
              }

              if (res.promo_type == 2) {
                this.payableAmount = parseFloat(this.payableAmount.toString()) - Number.parseFloat(this.couponAmount.toString());
              }

              this.api.showToast("Coupon added", "5000", "bottom");
            } else {
              this.isGiftCodeInput = false;
              this.promoCode = "";
              this.api.showToast(res.error, "3000", "bottom");
            }
          }
        },
        (err: any) => {
          this.isGiftCodeInput = false;
          this.promoCode = "";
          this.api.autoLogout(err, data);
        }
      );
  }

  addPromoCode() {
    const promoCode = this.promoCodeForm.value.giftvoucher;
    this.api.showLoader();
    this.api
      .redeemGiftCard(promoCode)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          {
            if (res.status) {
              this.promoCode = promoCode;
              this.isGiftCodeInput = true;
              this.analytics.logEvent(PetcloudApiService.usedcoupon, { userId: this.userId });
              this.api.showToast("Coupon added", "5000", "bottom");
            } else {
              this.isGiftCodeInput = false;
              this.promoCode = "";
              this.api.showToast(res.error, "3000", "bottom");
            }
          }
        },
        (err: any) => {
          this.isGiftCodeInput = false;
          this.promoCode = "";
          this.api.autoLogout(err, promoCode);
        }
      );
  }

  async autoRechargeWallet(event) {
    this.auto_recharge == true ? 1 : "";
    this.api.autoRechargeWallet(event.detail.checked === true ? 1 : "").pipe(
      finalize(() => { this.api.hideLoader(); })).subscribe(
        async (res: any) => {

          if (!res.status) {
            this.api.showToast("Issue in auto recharge, try again later", 3000, "bottom");
          } else {
            await this.storage.get(PetcloudApiService.USER)
              .then(async (userData: User) => {
                userData.auto_recharge = await event.detail.checked == false ? 0 : 1;
                await this.storage.set(PetcloudApiService.USER, userData).then(respons => {
                });
              });
          }
        },
        (err: any) => {
          this.api.autoLogout(err, event.detail.checked === true ? 1 : "");
        }
      );

  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      (user: User) => {

        let paypalData: any = user.paypal;
        let client_key: any = paypalData.ClientID;
        let enviroment: any = paypalData.mode;

        this.paypalSandboxKey = enviroment == "sandbox" ? client_key : "";
        this.paypalProductionKey = enviroment == "live" ? client_key : "";
        this.userId = user.id;
        user.auto_recharge == 1 ? this.auto_recharge = true : this.auto_recharge = false;
        this.getCardsList();
      },
      (err) => {

      }
    );
  }
  async goToVerification() {
    this.api.showLoader();
    this.api.getOtp().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      console.log(res);
      const modal = await this.modalCtrl.create({
        component: OtpVerificationPage,
        animated: true,
        backdropDismiss: false,
        componentProps: {
          'phone_number': res.phone_number,
          'type': 'add_money'
        }
      });
      modal.onDidDismiss()
        .then((data: any) => {
          if (data.data == 'add_money') {
            let paymentGateWay = this.addMoney.value.paymentGateway;
            this.addCreditAPI(this.creditAmount, "", "stripe")
          }
        });
      return await modal.present();
    }, err => {
      this.api.autoLogout(err, "");
    })
    // this.nav.navigateForward(['/otp-verification'])
  }

}
