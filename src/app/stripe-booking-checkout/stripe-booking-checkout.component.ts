import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController, NavParams, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { User } from "../model/user";
import { finalize, takeUntil } from "rxjs/operators";
import { AlertController } from "@ionic/angular";
import { AddCardDetailsComponent } from "../add-card-details/add-card-details.component";
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { BookingSuccessComponentComponent } from "../booking-success-component/booking-success-component.component";
import { AnalyticsService } from "../analytics.service";
import { AppsFlyerService } from "../apps-flyer.service";
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
declare var Stripe;
@Component({
  selector: 'app-stripe-booking-checkout',
  templateUrl: './stripe-booking-checkout.component.html',
  styleUrls: ['./stripe-booking-checkout.component.scss'],
})
export class StripeBookingCheckoutComponent implements OnInit {
  stripe = Stripe("pk_test_zkkFAGZwDD9xy11honnnetBC");
  @ViewChild('stripeButton', { read: ElementRef }) stripeButton: ElementRef;
  componentDestroyed$: Subject<boolean> = new Subject()
  private _routerSub = new Subscription();
  public _routerSubscription_pageName = new Subscription();
  cards: any = [];
  promoCode: "";
  isActiveClass: boolean = false;
  public couponAmount = 0;
  differenceDayCalcualte: any;
  stripeSessionId: any = '';
  public payableAmount: any = 0;
  public transactionalFees = 0;
  public creditAmount = 0;
  public available_wallet_balance = 0;
  public isBalanceCheck: boolean = false;
  public message: any;
  public selectedSegment = 'bookingAssistant';
  public booking_status: any;
  public userId: any;
  public isPreAuthBlock: boolean = false;
  paypalProductionKey = "";
  paypalSandboxKey = "";
  auto_recharge: boolean = false;
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
  public costData: any = {};
  public userData: any;
  public shareNumber = false; // share my number with sitter checkbox
  public termsAccpted: boolean = false;
  public coupneCode = '';
  public totalCost = 0;
  public bookingCost = 0;
  public sendBookingRequestClick: boolean = false;
  sendBookingInquiryButton: boolean = false;
  isRSPCADonationChecked: boolean = true;
  public isStripeEnable: any // Check Strip is Enabled or not.
  public isReviewLikeUnlike: boolean = false;
  public messageDetails: any;
  public messageRes: any;
  public messageMinderInfo: any;
  public messageOwnerInfo: any;
  public messageMinderId: any;
  public messageOwnerId: any;
  public showHideMeetGreetButton: boolean = false;
  public mapAddress: any;
  public isCheckedTC: boolean = false;
  public isNumberShare: boolean = false;
  public isCheckboxUnChecked: boolean = false;
  public cancel_request_from: any;
  public requestedBy: any;
  public paymentVeried: boolean = false;
  public showCelebrationAnaimation: boolean = false;
  public isAPILoaded: boolean = false;
  public inspectionDateIndex = 0;
  public pickUpDate: any;
  public pickEndDate: any;
  public pickUpStartTime: any;

  public decline_request = null
  public cancel_request = null
  public chargeAmount = 0;
  public available_balance = 0;
  public isWalletAuthorizedButtonClicked = false;
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
    private datepipe: DatePipe,
    public navCtrl: NavController
  ) {
  }
  ngAfterViewInit() {
    const stripeButton = this.stripeButton.nativeElement;
    var that = this;
    stripeButton.addEventListener('click', event => {
      console.log("=== ON CLIQUE LE BUTTON ");
      // let params = {
      //   "booking_id": 451,
      //   "coupon_status": 'valid',
      //   "amount": 111.00,
      //   "giftvoucher": "",
      //   "success_url": "https://petcloud.com/wallet"
      // }
      that.payNow()
    });
    console.log(this.stripe, "stripe")

    // this.stripe.confirmCardPayment((r: any) => {
    //   console.log(r, "rrrrrrrrrrrrrrrrrrrrrr")
    // })
  }
  async ngOnInit() {
    this.navParam.bookingId = await this.navParams.get("bookingId");
    this.navParam.amount = await this.navParams.get("amount");
    this.navParam.availableWalletBalance = await this.navParams.get("available_wallet_balance");
    this.isBalanceCheck = await this.navParams.get("isBalanceCheck");
    this.callMethodName = await this.navParams.get("methodName");
    this.getInfo();
    this.storage.get(PetcloudApiService.USER)
      .then((userData: any) => {
        this.userData = userData;
      });

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
        // this.getCardsList();
        this.getMessageDetails(this.navParam.bookingId)
      },
      (err) => {

      }
    );
  }
  getMessageDetails(messageId) {
    this.api.showLoader();
    this._routerSub.add(

      this.api.getMessageDetails(messageId)
        .pipe(takeUntil(this.componentDestroyed$), finalize(() => {
          this.api.hideLoader();
        })).subscribe(async (res: any) => {
          if (res.success) {
            this.isAPILoaded = true;
            this.messageRes = res
            this.message = res.booking;
            this.messageDetails = await res.booking;
            console.log("this.messageDetails", this.messageDetails);
            this.booking_status = res.booking.booking_status;
            this.messageOwnerId = res.booking.owner.id
            this.messageMinderId = res.booking.minder.id;
            console.log(this.messageOwnerId, " this.messageOwnerId ", this.userId)
            console.log(this.messageMinderId, " this.messageMinderId ", this.userId)
            this.chargeAmount = parseFloat(res.chargeAmount);
            this.available_balance = parseFloat(res.available_balance);

            this.decline_request = res.booking.decline_request;
            this.cancel_request = res.booking.cancel_request;

            this.pickUpDate = this.messageDetails.startDate != "" ? await moment(this.messageDetails.startDate).format("MMM DD YYYY, h:mm A") : "";
            this.pickEndDate = this.messageDetails.endDate != "" ? await moment(this.messageDetails.endDate).format("MMM DD YYYY, h:mm A") : "";
            this.pickUpStartTime = this.messageDetails.pickUpStartTime != "" ? await moment(this.messageDetails.startDate).format("h:mm A") : "";

            if (!this.paymentVeried) {
              let addCard = [{
                callToAction: "addCard",
                noButtons: null
              }]
              this.messageDetails.messages = [...addCard, ...this.messageDetails.messages];
            }

            this.messageMinderInfo = res.booking.minder;
            let cancel_from = res.booking.cancel_request_from;
            this.dateTimeDifference();
            if (cancel_from != null) {
              this.cancel_request_from = this.userId == this.messageDetails.ownerid ?
                this.messageDetails.owner.first_name : this.messageDetails.minder.first_name
            }

            if (this.messageDetails.meetngreet != null) {
              this.mapAddress = this.messageDetails.meetngreet.address
            }


            if (this.messageDetails.booking_status == 'PP') {
              this.messageDetails.messages.forEach(element => {
                if (element.callToAction == "JA" && element.noButtons == null) {
                  this.isPreAuthBlock = true;
                } else if (element.callToAction == "BCDCF" && element.noButtons == null) {
                  this.isPreAuthBlock = true;
                } else if (element.callToAction == "BA" && element.noButtons == null) {
                  this.isPreAuthBlock = true;
                }
              });
            }

            // SET Radio Button of Inspection default to 0 Index..
            if (this.messageDetails.meetngreet) {
              if (this.messageDetails.meetngreet.inspection_dates.length) {
                this.messageDetails.meetngreet.inspection_dates.map((x, index) => {
                  x.id = index,
                    x.checked = false
                });

                this.messageDetails.meetngreet.inspection_dates[0].checked = true
              }

            }



          }

        }, (err: any) => {
          this.isAPILoaded = false;

          // this.api.autoLogout(err, this.chatBookingId);
        })
    )
  }
  dateTimeDifference() {
    let date;
    // define two dates to get diffrence between dates.
    const currDate = new Date();
    if (this.messageDetails.messageView == null) {
      if (this.messageDetails.booking_status == "MD") {
        date = new Date(this.message.startDate);
      } else if (this.messageDetails.booking_status == "CURR") {
        date = new Date(this.message.endDate);
      }
      // using moment function substraction of two dates to get days hours minutes and seconds.
      const ms = moment(date, "DD/MM/YYYY HH:mm").diff(moment(currDate, "DD/MM/YYYY HH:mm"));
      const d = moment.duration(ms);
      this.differenceDayCalcualte = '<div>' + d.days() + '<h5>Days</h5></div><div>' + d.hours() + '<h5>Hours</h5></div><div>' + d.minutes() + '<h5>Minutes</h5></div><div>';
    }
  }
  payNow() {
    let params = {
      amount: this.navParam.amount,
      giftvoucher: this.isGiftCodeInput
        ? this.promoCodeForm.value.giftvoucher
        : "",
      coupon_status: this.isGiftCodeInput ? "valid" : "",
      booking_id: this.navParam.bookingId,
      success_url: "https://www.petcloud.com.au/wallet"
    };
    this.api.showLoader();
    this.api.stripeCheckoutSession(params).subscribe((res: any) => {
      // console.log(res);
      localStorage.setItem('stripeSessionId', res.id)
      this.stripeSessionId = res.id;
      if (res.status) {
        this.stripe.redirectToCheckout({ sessionId: res.id }).then((result) => {
          alert("Df")
          // console.log(result, "result");
          // this.navCtrl.navigateRoot(['/home/tabs/messages/messages-list']);
        })
      } else {
      }
    }, (err: any) => {
      this.api.showToast(err, 3000, 'bottom');
    });
  }
  closeModal() {
    this.model.dismiss("donotrefresh");
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

}
