
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { User } from "../model/user";
import { finalize } from "rxjs/operators";
import { AlertController } from "@ionic/angular";
import { AddCardDetailsComponent } from "../add-card-details/add-card-details.component";
import { Router } from "@angular/router";
import { BookingSuccessComponentComponent } from "../booking-success-component/booking-success-component.component";
import { AnalyticsService } from "../analytics.service";
import { AppsFlyerService } from "../apps-flyer.service";

@Component({
  selector: "app-wallet-booking-checkout",
  templateUrl: "./wallet-booking-checkout.component.html",
  styleUrls: ["./wallet-booking-checkout.component.scss"],
})
export class WalletBookingCheckoutComponent implements OnInit {
  public addCredit = [
    { amount: "$20", css: false, },
    { amount: "$100", css: true, },
    { amount: "$150", css: false, },
    { amount: "$200", css: false, },
  ];


  cards: any = [];
  promoCode: "";
  isActiveClass: boolean = false;
  public couponAmount = 0;

  public payableAmount: any = 0;
  public transactionalFees = 0;
  public creditAmount = 0;
  public available_wallet_balance = 0;
  public isBalanceCheck: boolean = false;

  paypalProductionKey = "";
  paypalSandboxKey = "";
  auto_recharge: boolean = false;
  userId: any;
  public addMoney: FormGroup;
  public promoCodeForm: FormGroup;
  public tempAmount = 0;

  public isGiftCodeInput: boolean = false;
  public promoType: any;
  navParam = {
    amount: "",
    bookingId: "",
    availableWalletBalance: "",
  };
  minimumRequiredBalance: any;
  callMethodName: any;

  constructor(
    public model: ModalController,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public api: PetcloudApiService,
    public navParams: NavParams,
    public router: Router,
    public storage: Storage,
    public analytics: AnalyticsService,
    public appsFlyerAnalytics: AppsFlyerService,
  ) {
  }

  async ngOnInit() {
    this.promoCodeForm = this.formBuilder.group({
      giftvoucher: ["", [Validators.required]],
      amount: ["", [Validators.required]],
    });

    this.addMoney = this.formBuilder.group({
      userEditedAmount: ["", [Validators.required]],
      selectAmount: [""],
      otherAmount: [""],
      default_card: [""],
      paymentGateway: ["", [Validators.required]],
    });

    this.navParam.bookingId = await this.navParams.get("bookingId");
    this.navParam.amount = await this.navParams.get("amount");
    this.navParam.availableWalletBalance = await this.navParams.get("available_wallet_balance");
    this.isBalanceCheck = await this.navParams.get("isBalanceCheck");
    this.callMethodName = await this.navParams.get("methodName");

    if (!this.isBalanceCheck) {
      if (this.navParams.get("amount") > 100) {
        const availableBal: any = parseFloat(this.navParam.availableWalletBalance).toFixed(2);
        this.minimumRequiredBalance = 100 - availableBal;
        this.onOtherAmount(this.minimumRequiredBalance.toFixed(2));
        this.addMoney.patchValue({ otherAmount: this.minimumRequiredBalance.toFixed(2) });
        this.promoCodeForm.patchValue({
          amount: this.minimumRequiredBalance,
        });
      } else {
        this.minimumRequiredBalance = parseFloat(this.navParam.amount) - parseFloat(this.navParam.availableWalletBalance);
        this.minimumRequiredBalance = this.minimumRequiredBalance.toFixed(2);
        this.onOtherAmount(this.minimumRequiredBalance);
        this.addMoney.patchValue({
          otherAmount: this.minimumRequiredBalance,
        });
        this.promoCodeForm.patchValue({
          amount: this.minimumRequiredBalance,
        });
      }
    } else {
      this.addCredit[1].css = false;

      this.minimumRequiredBalance =
        parseFloat(this.navParam.amount) -
        parseFloat(this.navParam.availableWalletBalance);
      this.onOtherAmount(this.minimumRequiredBalance.toFixed(2));
      this.addMoney.patchValue({
        otherAmount: this.minimumRequiredBalance.toFixed(2),
      });
      this.promoCodeForm.patchValue({
        amount: this.minimumRequiredBalance.toFixed(2),
      });
    }

    this.getInfo();
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
        user.auto_recharge == 1 ? (this.auto_recharge = true) : (this.auto_recharge = false);
        this.getCardsList();
      },
      (err) => {

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
                  });
                  if (this.cards.length) {
                    this.selectedCard(this.cards[0]);
                  }
                }
              }
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
            if (res.status == true) {
              this.getCardsList();
            } else {
              this.api.showToast(res.message, "3000", "bottom")
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
            this.makeDefaultCardAPI(card_id);
          },
        },
      ],
    });
    await alert.present();
  }

  async addCardModel() {
    const modal = await this.model.create({
      component: AddCardDetailsComponent,
      animated: true,
      componentProps: {
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.getCardsList();
    });
    return await modal.present();
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

  closeModal() {
    this.model.dismiss("donotrefresh");
  }

  selectedCard(card) {
    let cardId = card.id;

    this.addMoney.patchValue({
      default_card: cardId,
      paymentGateway: "",
    });

    if (this.addMoney.value.default_card != "") {
      this.addMoney.controls["paymentGateway"].setValidators([]);
      this.addMoney.controls["paymentGateway"].updateValueAndValidity();
    }

    this.cards.forEach((element) => {
      if (element.id == card.id) {
        element.css = true;
      } else {
        element.css = false;
      }
    });
  }

  async autoRechargeWallet(event) {
    this.auto_recharge == true ? 1 : "";
    this.api
      .autoRechargeWallet(event.detail.checked === true ? 1 : "")
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          if (!res.status) {
            this.api.showToast(
              "Issue in auto recharge, try again later",
              3000,
              "bottom"
            );
          } else {
            await this.storage
              .get(PetcloudApiService.USER)
              .then(async (userData: User) => {
                userData.auto_recharge =
                  (await event.detail.checked) == false ? 0 : 1;
                await this.storage
                  .set(PetcloudApiService.USER, userData)
                  .then((respons) => {

                  });
              });
          }
        },
        (err: any) => {
          this.api.autoLogout(err, event.detail.checked === true ? 1 : "");
        }
      );
  }


  onOtherAmount(event) {
    this.tempAmount = event;
    this.creditAmount = event;
    if (event != "") {
      this.calculateTransactionalAmount(this.tempAmount);
    } else {
      this.transactionalFees = 0;
      this.payableAmount = 0;
      this.tempAmount = 0;
      this.creditAmount = 0;
    }

    this.addMoney.patchValue({
      userEditedAmount: event,
    });
  }

  onSelectedCredit(credit) {

    this.addCredit.forEach((data) => {
      data.amount == credit.amount ? (data.css = true) : (data.css = false);
    });

    if (this.addMoney.value.otherAmount != "") {

      let creditAmount = credit.amount.replace("$", "");
      this.tempAmount = parseFloat(creditAmount) + parseFloat(this.tempAmount.toString());

      this.creditAmount = this.tempAmount;
      this.promoCodeForm.patchValue({
        amount: this.tempAmount.toFixed(2),
      });

      this.addMoney.patchValue({
        userEditedAmount: this.tempAmount,
        otherAmount: this.tempAmount.toFixed(2),
      });
      this.calculateTransactionalAmount(this.tempAmount);
    } else {
      let creditAmount = credit.amount.replace("$", "");
      this.tempAmount = parseInt(creditAmount) + this.tempAmount;


      this.creditAmount = this.tempAmount;
      this.promoCodeForm.patchValue({
        amount: credit.amount.replace("$", ""),
      });

      this.addMoney.patchValue({
        userEditedAmount: credit.amount.replace("$", ""),
        otherAmount: "",
      });
      this.calculateTransactionalAmount(this.tempAmount);
    }
  }

  calculateTransactionalAmount(amount) {
    if (amount === 0) {
      this.transactionalFees = 0;
      this.payableAmount = 0;
    } else {
      this.transactionalFees = Number(((amount * 1.75) / 100 + 0.3).toFixed(2));
      this.payableAmount = parseFloat((1 * amount).toFixed(2)) + Number.parseFloat(this.transactionalFees.toFixed(2));
    }
  }

  checkCoupon() {
    if (this.tempAmount == 0) {
      this.api.showToast("Credit Amount cannot be 0", "3000", "bottom");
    } else if (this.tempAmount.toString() == "" || this.tempAmount == null) {
      this.api.showToast("Please Select Amount", "3000", "bottom");
    } else {
      const data = {
        giftvoucher: this.promoCodeForm.value.giftvoucher,
        amount: this.tempAmount,
      };

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
                  this.payableAmount =
                    parseFloat(this.payableAmount.toString()) -
                    parseFloat(this.couponAmount.toString());
                }
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
            this.api.autoLogout(err, data);
          }
        );
    }
  }

  addFunds() {
    let paymentGateWay = this.addMoney.value.paymentGateway;
    this.addCreditAPI(this.creditAmount, "", "stripe");
  }

  goToAddMoney() {
    this.model.dismiss("goToAddMoney");
  }

  authorizeBookingViaWallet(potential_revenue) {
    const param = {
      id: this.navParam.bookingId,
    };
    this.api.showLoader();
    this.api
      .authorizeBookingViaWallet(param)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          if (res.success) {

            this.appsFlyerBookingAnalytics("A", this.navParam.bookingId,
              potential_revenue, "", res.minderId, res.ownerid)

            this.analytics.logEvent(PetcloudApiService.preauthorized, { userId: this.userId });
            this.api.showToast("Booking Authorized", "3000", "bottom");
            this.model.dismiss("modelCloseWithRefresh");
          } else {
            if (res.checkout) {
              this.api.showToast(res.error, "3000", "bottom");
            } else {
              this.api.showToast("Something went wrong", "3000", "bottom");
            }
          }
        },
        (err) => {
          this.api.autoLogout(err, param);
        }
      );
  }

  addCreditAPI(amount, paymentId, source) {
    if (!this.isBalanceCheck) {
      if (parseFloat(this.navParam.amount) >= this.minimumRequiredBalance) {
        if (this.creditAmount < this.minimumRequiredBalance) {
          this.api.showToast(
            "Minimum required Amount is $ " + this.minimumRequiredBalance.toFixed(2), "3000", "bottom");
        } else {
          this.saveCreditDataAPI(amount, paymentId, source);
        }
      }
    } else {
      if (Number(this.creditAmount) < this.minimumRequiredBalance.toFixed(2)) {
        this.api.showToast(
          "Minimum required Amount is $ " + this.minimumRequiredBalance.toFixed(2),
          "3000",
          "bottom"
        );
      } else {
        this.saveCreditDataAPI(amount, paymentId, source);
      }
    }
  }

  saveCreditDataAPI(amount, paymentId, source) {


    let addCreditParams = {
      amount,
      transaction_id: source == "paypal" ? paymentId : "",
      deposit_source: source,
      giftvoucher: this.isGiftCodeInput
        ? this.promoCodeForm.value.giftvoucher
        : "",
      coupon_status: this.isGiftCodeInput ? "valid" : "",
      card_id: this.addMoney.value.default_card,
      booking_id: this.navParam.bookingId,
    };
    this.api.showLoader();
    if (this.callMethodName == "confrimMyRemoteBooking") {
      this.api.walletCheckOutSocket(addCreditParams).pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe(async (res: any) => {
        if (res.status) {
          this.model.dismiss('', 'socketSuccess');
        } else {
          let msg = res.error ? res.error : res.message ? res.message : 'Something went wrong';
          this.api.showToast(msg, 2000, 'bottom');
        }
      }, err => {
        this.api.autoLogout(err, addCreditParams);
      });
    } else {
      this.api
        .addCredits(addCreditParams)
        .pipe(
          finalize(() => {
            this.api.hideLoader();
          })
        )
        .subscribe(
          (res: any) => {
            {
              if (res.success) {
                this.api.showToast(res.message, 2000, "bottom");

                if (
                  this.callMethodName == "confrimMyBooking" &&
                  this.isBalanceCheck == false
                ) {
                  this.authorizeBookingViaWallet(addCreditParams.amount);
                } else if (
                  this.callMethodName == "confrimMyBooking" &&
                  this.isBalanceCheck == true
                ) {
                  this.walletBalanceAPICheck();
                } else if (this.callMethodName == "meetGreetAwesome") {
                  this.meetandGreetAwesome(amount);
                }
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

  }


  walletBalanceAPICheck() {
    const param = { id: this.navParam.bookingId };
    this.api.showLoader();
    this.api.walletCheckBalance(param).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      if (res.status) {
        this.ownerConfrimBooking();
      } else {
        if (res.checkout) {

        } else {
          this.api.showToast("Something went wrong", "3000", "bottom");
        }
      }
    }, err => {
      this.api.autoLogout(err, param);
    })
  }



  ownerConfrimBooking() {
    this.api.showLoader();
    this.api.ownerconfirmBooking(this.navParam.bookingId).subscribe(
      (res: any) => {

        this.api.hideLoader();
        if (res.success) {
          this.api.showToast(res.message, 2000, "bottom");
          this.appsFlyerBookingAnalytics("MD", this.navParam.bookingId,
            "", res.actualrevenue, res.minderId, res.ownerid)
          if (this.callMethodName == "confrimMyRemoteBooking") {
            this.model.dismiss('', 'socketSuccess');
          } else {
            this.bookingSuccessModel();
          }
        } else {
          this.api.showToast(res.message, 2000, "bottom");
          this.model.dismiss("modelCloseWithRefresh");
        }
      },
      (err: any) => {
        this.api.autoLogout(err, "");
      }
    );
  }

  async bookingSuccessModel() {
    const modal = await this.model.create({
      component: BookingSuccessComponentComponent,
      animated: true,
      componentProps: {
        bookingId: this.navParam.bookingId,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.model.dismiss("modelCloseWithRefresh");
    });
    return await modal.present();
  }

  async meetandGreetAwesome(actual_revenue) {
    this.api.showLoader();
    this.api.meetandgreetwentwell(this.navParams.get("bookingId")).subscribe(
      (res: any) => {
        this.api.hideLoader();
        if (res.success) {
          this.appsFlyerBookingAnalytics("MD", this.navParam.bookingId, "", res.actualrevenue, res.minderId, res.ownerid)
          this.bookingSuccessModel();
          this.api.showToast(res.message, 2000, "bottom");
          this.model.dismiss("modelCloseWithRefresh");
        } else {
          this.api.showToast(res.message, 2000, "bottom");
        }
      },
      (err: any) => {
        this.api.autoLogout(err, "");
      }
    );
  }

  appsFlyerBookingAnalytics(bookingStatus, bookingId, af_potentional_revenue, af_actual_revenue, minderId, owenerId) {
    const booking = {
      af_booking_status: bookingStatus,
      af_booking_id: bookingId,
      af_potentional_revenue: af_potentional_revenue,
      af_actual_revenue: af_actual_revenue,
      af_minder_id: minderId,
      af_owner_id: owenerId
    }
    this.appsFlyerAnalytics.bookingEvent(booking);
  }
  //   walletCheckOutSocket(addCreditParams) {
  //     // const param = {id: this.navParam.bookingId};
  //     this.api.showLoader();
  //     this.api.walletCheckOutSocket(addCreditParams).pipe(finalize(() => {
  //         this.api.hideLoader();
  //     })).subscribe(async (res: any) => {
  //         if (res.status) {
  //           this.model.dismiss('', 'socketSuccess');
  //         } else {
  //           let msg = res.error? res.error : res.message? res.message: 'Something went wrong';
  //           this.api.showToast(msg, 2000, 'bottom');
  //         }
  //     }, err => {
  //         this.api.autoLogout(err, addCreditParams);
  //     })
  // }
}
