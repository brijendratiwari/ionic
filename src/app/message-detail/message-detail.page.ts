import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { MeetandGreetComponentComponent } from '../meetand-greet-component/meetand-greet-component.component';
import { DatePipe } from '@angular/common';
import { interval, Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { User } from '../model/user';
import { RequestCancellationComponent } from '../request-cancellation/request-cancellation.component';
import { OwnerDeclineBookingComponent } from '../owner-decline-booking/owner-decline-booking.component';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/File/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AlterBookingCostComponent } from '../alter-booking-cost/alter-booking-cost.component';
import { PetDetailsComponent } from '../pet-details/pet-details.component';
import { MeetngreetNotSoGreatComponent } from '../meetngreet-not-so-great/meetngreet-not-so-great.component';
import { LeaveaReviewComponent } from '../messages/leavea-review/leavea-review.component';
import { ChatServiceService } from '../chat-service.service';
import { ChatscreenComponent } from '../chatscreen/chatscreen.component';
import { Chatter } from '../model/chatter';
import { Market } from '@ionic-native/market/ngx';
import { WalletBookingCheckoutComponent } from '../wallet-booking-checkout/wallet-booking-checkout.component';
import { ModifyBookingComponent } from '../modify-booking/modify-booking.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AnalyticsService } from '../analytics.service';
import { AppsFlyerService } from '../apps-flyer.service';
import { BookingSuccessComponentComponent } from '../booking-success-component/booking-success-component.component';
import { HTMLIonOverlayElement } from '@ionic/core';

@Component({
    selector: 'app-message-detail',
    templateUrl: './message-detail.page.html',
    styleUrls: ['./message-detail.page.scss'],
})
export class MessageDetailPage implements OnInit {

    public message: any;
    public selectedSegment = 'bookingAssistant';
    public booking_status: any;
    public userId: any;
    public isPreAuthBlock: boolean = false;
    // Accept Job Params Data
    acceptJobParams: any = { id: "" };
    // Accept Job Params Data
    authCard: any = { id: "" };
    //unsuitable Booking
    unsuitableParams: any = { reason: "", bookingId: '' }
    bookingStartsTimer: any;
    currentDate: any;
    differenceDayCalcualte: any;
    userName: any;
    public fcmToken: any;
    public confetti = new Array(150);

    //Boolean
    isMinder: boolean = false;
    isMeetandGreetEdit: boolean = false;
    @Input() chatBookingId: any = "";
    @Input() onlyProfile: boolean = false;

    public isStripeEnable: any // Check Strip is Enabled or not.
    public paypalSandboxKey: any;
    public paypalProductionKey: any;

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
    componentDestroyed$: Subject<boolean> = new Subject()
    public userData: any = null;

    public chargeAmount = 0;
    public available_balance = 0;
    public isWalletAuthorizedButtonClicked = false;


    private _routerSub = new Subscription();
    public _routerSubscription_pageName = new Subscription();

    constructor(private router: Router, protected activatedRoute: ActivatedRoute,
        protected storage: Storage,
        public navCntl: NavController,
        public alertController: AlertController,
        public modalCtrl: ModalController,
        public actionSheetController: ActionSheetController,
        public api: PetcloudApiService,
        public navcntl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private platform: Platform,
        private file: File,
        private ft: FileTransfer,
        private model: ModalController,
        private fileOpener: FileOpener,
        private chatsService: ChatServiceService,
        public market: Market,
        private callNumber: CallNumber,
        public analytics: AnalyticsService,
        public appsFlyerService: AppsFlyerService,
        private document: DocumentViewer) {
        this.currentDate = new DatePipe('en-US').transform(new Date(), 'y-MM-dd')
    }
    async ngOnInit() {
        this.fcmToken = localStorage.getItem('fcmToken');
    }

    ionViewWillEnter() {
        if (!this.onlyProfile) {
            this.activatedRoute.queryParams.subscribe((async res => {
                this.chatBookingId = await res.id;
                this.getInfo(res.id); // Message Id
            }))
        } else {
            this.selectedSegment = 'info';
            this.getInfo(this.chatBookingId); // Message Id
        }
    }

    closeAll() {
        // adjust selector to fit your needs
        const overlays = document.querySelectorAll('ion-modal');
        const overlaysArr = Array.from(overlays) as HTMLIonOverlayElement[];
        overlaysArr.forEach(o => o.dismiss());
    };

    redirectProfile() {
        this.closeAll();
        if (this.userId == this.messageOwnerId)
            this.router.navigate(["/pet-sitter-detail", this.messageMinderId]);

        if (this.userId == this.messageMinderId)
            this.router.navigate(["/pet-sitter-detail", this.messageOwnerId]);

    }


    ngOnDestroy() {
        this._routerSubscription_pageName.unsubscribe();
        this._routerSub.unsubscribe();
        this.componentDestroyed$.next(true)
        this.componentDestroyed$.complete()
    }

    postJob() {
        this.navCntl.navigateRoot('/home/tabs/jobs-tab');
    }

    goToExplore() {
        this.navCntl.navigateRoot('/home/tabs/jobs-tab/view-jobs');
    }
    viewJobs() {
        this.router.navigate(['/home/tabs/jobs-tab/view-jobs', { jobId: this.messageDetails.jobId }]);
    }


    sendFeedbackEmail = async () => {

        this.api.sendEmailtoAccounts("app.improvements@petcloud.com.au", [""], "Pet Cloud app review", "");

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


                        this.addUser(this.fcmToken);
                    }

                }, (err: any) => {
                    this.isAPILoaded = false;

                    this.api.autoLogout(err, this.chatBookingId);
                })
        )
    }

    addUser(fcmToken): void {

        let type = this.userId == this.messageDetails.owner.id ? "owner" : "minder"
        let userModel: Chatter = {
            userId: this.userId,
            isOnline: false,
            isTyping: false,
            lastSeen: this.api.getDateTime(),
            type,
            fcmToken
        };
        this.chatsService.addUser(this.chatBookingId, userModel).then((res: any) => {
        }, (err: any) => {
        });
    }


    async deleteBooking() {
        const alert = await this.alertController.create({
            header: 'Decline Booking',
            subHeader: 'Please provide the reason for declining this booking',
            inputs: [
                {
                    name: 'reason',
                    type: 'text',
                    label: 'Please provide the reason for declining this booking',
                }
            ],
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',

                }, {
                    text: 'Decline Booking',
                    handler: (data) => {


                        const bookingCancelFrm = {
                            'BookingCancelForm': {
                                'reason': data['reason'],
                                'bookingId': this.message.id
                            }
                        };

                        this.api.showLoader();
                        this.api.bookingDecline(bookingCancelFrm, this.message.id)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {
                                    this.appsFlyerAnalytics("D", this.message.id, "", "", this.messageDetails.minderId, this.messageDetails.ownerid);

                                    this.api.showToast('Booking Cancel successful', 2000, 'bottom');
                                    this.goToMessages()
                                } else {
                                    this.api.showToast(res.error, 2000, 'bottom');
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, bookingCancelFrm);
                            });
                    }
                }
            ]
        });
        await alert.present();
    }

    async ownerCancelBooking() {
        const alert = await this.alertController.create({
            header: 'Cancel Booking',
            subHeader: 'Please provide the reason for Cancel this booking',
            inputs: [
                {
                    name: 'reason',
                    type: 'text',
                    label: 'Please provide the reason for Cancel this booking',
                }
            ],
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Cancel Booking',
                    handler: (data) => {
                        this.api.showLoader();
                        const CancelBooking = {
                            'reason': data.reason,
                            'bookingId': this.message.id
                        };
                        this.api.ownerCancelBooking(this.message.id, CancelBooking)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {


                                    this.appsFlyerAnalytics("D", res.booking.id,
                                        "", "", this.messageDetails.minderId, this.messageDetails.ownerid)

                                    this.api.showToast(res.message, 2000, 'bottom');
                                    this.goToMessages()
                                } else {
                                    this.api.showToast(res.message, 2000, 'bottom');
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, CancelBooking);
                                this.api.hideLoader();
                                this.api.showToast('Try again', 2000, 'bottom');

                            });
                    }
                }
            ]
        });
        await alert.present();
    }

    letsMeet(status) {
        if (status == 'J') {
            this.letsMeetsAPI()
        } else {
            if (this.isCheckedTC && this.isNumberShare) {
                this.isCheckboxUnChecked = false;
                this.acceptJob();
            } else if (!this.isCheckedTC) {
                this.isCheckboxUnChecked = true;
            } else if (!this.isNumberShare) {
                this.isCheckboxUnChecked = true;
            }
        }
    }

    acceptJob() {

        this.api.showLoader();
        this.api.acceptJob(this.chatBookingId)
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe(async (res: any) => {
                if (res.status) {
                    this.appsFlyerAnalytics("P", this.messageDetails.id, "", "", this.messageDetails.minderId, this.messageDetails.ownerid);
                    this.api.showToast(res.message, '2000', 'bottom');
                    this.goToMessages()
                } else {
                    this.api.showToast(res.error, '2000', 'bottom')
                    this.goToMessages()
                }
            }, (err: any) => {
                this.api.autoLogout(err, this.chatBookingId);
            });
    }

    public letsMeetsAPI() {
        this.acceptJobParams.id = this.chatBookingId;
        this.api.showLoader();
        this.api.letsMeet(this.acceptJobParams)
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe((res: any) => {
                if (res.success) {

                    this.appsFlyerAnalytics(res.booking.booking_status, res.booking.id,
                        "", "", this.messageDetails.minderId, this.messageDetails.ownerid)

                    this.api.showToast("Success", '2000', 'bottom');
                    this.goToMessages()
                } else {
                    this.api.showToast("Try Again", '2000', 'bottom')
                    this.goToMessages()
                }
            }, (err: any) => {
                this.api.autoLogout(err, this.acceptJobParams);
            });

    }


    async unsuitableBooking() {
        const alert = await this.alertController.create({
            header: 'Unsuitable Booking',
            subHeader: 'Do you want to mark as Unsuitable Booking?',
            inputs: [
                {
                    name: 'reason',
                    type: 'text',
                    label: 'Please provide the reason for Unsuitable Booking',
                }
            ],
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',

                }, {
                    text: 'Unsuitable Booking',
                    handler: (data) => {

                        this.unsuitableParams.reason = data.reason;
                        this.unsuitableParams.bookingId = this.message.id;

                        const bookingCancelFrm = {
                            'reason': data.reason,
                            'bookingId': this.message.id
                        };
                        this.api.showLoader();
                        this.api.unsuitableBooking(this.messageDetails.jobId, this.message.id, bookingCancelFrm)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {

                                    this.appsFlyerAnalytics("E", res.booking.id,
                                        "", "", this.messageDetails.minderId, this.messageDetails.ownerid)

                                    this.api.showToast(res.message, 2000, 'bottom');
                                    this.goToMessages()
                                } else {
                                    this.api.showToast(res.message, 2000, 'bottom');
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, bookingCancelFrm);
                            });
                    }
                }
            ]
        }); await alert.present();

    }


    authorizeBookingViaWallet(id) {
        this.isWalletAuthorizedButtonClicked = true
        const param = {
            id
        }
        this.api.showLoader();
        this.api.authorizeBookingViaWallet(param)
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe(async (res: any) => {
                this.isWalletAuthorizedButtonClicked = false
                if (res.success) {
                    // potential revenue will be 100 when balance is already available in wallet.
                    this.appsFlyerAnalytics("A", id,
                        "100", "", this.messageDetails.minderId, this.messageDetails.ownerid)

                    this.analytics.logEvent(PetcloudApiService.preauthorized, { userId: this.userId });
                    this.api.showToast("Booking Authorized", "3000", "bottom");
                    this.goToMessages();
                } else {

                    if (res.checkout) {
                        this.api.showToast(res.error, "3000", "bottom");
                        this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, false, "confrimMyBooking")
                    } else if (res.error) {
                        this.api.showAlert('Booking Alert', res.error, [{ text: 'OK' }]);
                    } else {
                        this.api.showToast("Something went wrong", "3000", "bottom");
                    }
                }
            }, err => {
                this.isWalletAuthorizedButtonClicked = false
                this.api.autoLogout(err, param);
            })
    }



    async walletBookingCheckOutModel(booking_amount, wallet_balance, isBalanceCheck, methodName) {
        const modal = await this.modalCtrl.create({
            component: WalletBookingCheckoutComponent,
            animated: true,
            componentProps: {
                bookingId: this.chatBookingId,
                amount: booking_amount,
                available_wallet_balance: wallet_balance,
                isBalanceCheck,
                methodName
            }

        });
        modal.onDidDismiss()
            .then((data: any) => {
                if (data.data == "donotrefresh") {

                } else if (data.data == "modelCloseWithRefresh") {
                    this.goToMessages()
                } else if (data.data == "goToAddMoney") {
                    this.router.navigateByUrl("/addmoney");
                }

            });
        return await modal.present();
    }

    async walletCheckBalance(methodName) {
        if (methodName == "confrimMyBooking") {
            const alert = await this.alertController.create({
                header: 'Confirm MY BOOKING',
                subHeader: 'By clicking on OK, you indicate that you have met this person and happy to confirm this booking. We will now process a payment (Pay now only for 2 weeks if it’s a recurring booking). All bookings are covered with Pet Sitter Liability Insurance up to $5M',
                buttons: [
                    {
                        text: 'Close',
                        role: 'cancel',
                        cssClass: 'secondary',

                    }, {
                        text: 'Ok',
                        handler: (data) => {
                            this.walletBalanceAPICheck(methodName)

                        }
                    }
                ]
            });
            await alert.present();

        } else {
            this.walletBalanceAPICheck(methodName)

        }
    }


    walletBalanceAPICheck(methodName) {

        const param = { id: this.chatBookingId };
        this.api.showLoader();
        this.api.walletCheckBalance(param).pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe(async (res: any) => {
            if (res.status) {
                if (methodName == "confrimMyBooking") {
                    this.confrimMyBooking();
                } else if (methodName == "meetGreetAwesome") {
                    this.meetandGreetAwesome(this.chatBookingId);
                }

            } else {
                if (res.checkout) {
                    if (methodName == "confrimMyBooking") {
                        this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, true, "confrimMyBooking")
                    } else if (methodName == "meetGreetAwesome") {
                        this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, true, "meetGreetAwesome")
                    }
                } else if (res.error) {
                    this.api.showAlert('Booking Alert', res.error, [{ text: 'OK' }]);
                } else {
                    this.api.showToast("Something went wrong", "3000", "bottom");
                }
            }
        }, err => {
            this.api.autoLogout(err, param);
        })
    }

    goToWallet() {
        this.router.navigateByUrl("/wallet")
    }

    authorizeCard() {
        // Lets Meet API Param Set Value
        this.authCard.id = this.message.id;
        this.api.showLoader();
        this.api.bookingAuthorized(this.authCard)
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe((res: any) => {
                if (res.status) {
                    this.api.showToast(res.message, '2000', 'bottom');

                    this.showCelebrationAnaimation = true
                    setTimeout(() => {
                        this.showCelebrationAnaimation = false;
                        // this.appRating();
                        this.goToMessages();
                    }, 5000)
                } else {
                    this.api.showToast(res.error, '2000', 'bottom')
                }
            }, (err: any) => {
                this.api.autoLogout(err, this.authCard);
            });

    }

    async chargeOwner(bookingId) {

        const alert = await this.alertController.create({
            header: 'CONFIRM BOOKING FOR PET OWNER',
            subHeader: 'By clicking on OK, you indicate that you have met this Pet Owner' +
                'and happy to confirm this booking for. ' + this.messageDetails.owner.first_name
                + ' We will now charge the owner and you will be paid after booking end date (They will now pay for 2 weeks if this is a recurring booking). Please be proactive in communicating with your client on this booking.',
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',

                }, {
                    text: 'Ok',
                    handler: (data) => {

                        this.api.showLoader();
                        this.api.chargeownerbooking(bookingId)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {
                                    this.appsFlyerAnalytics("MD", this.messageDetails.id,
                                        "", res.actualrevenue, res.minderId, res.ownerid)
                                    this.goToMessages()

                                } else {
                                    this.api.showToast(res.error, "3000", "bottom");
                                    this.goToMessages()
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, bookingId);
                            });
                    }
                }
            ]
        }); await alert.present();
    }

    // Confrim My Booking Status is M
    async confrimMyBooking() {
        const alert = await this.alertController.create({
            header: 'CONFIRM BOOKING FOR PET OWNER',
            subHeader: 'By clicking on OK, you indicate that you have met this person and happy to confirm this booking. We will now process a payment (Pay now only for 2 weeks if it’s a recurring booking). All bookings are covered with Pet Sitter Liability Insurance up to $5M',
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',

                }, {
                    text: 'Ok',
                    handler: (data) => {

                        this.api.showLoader();
                        this.api.ownerconfirmBooking(this.message.id)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {

                                    this.appsFlyerAnalytics(
                                        "MD", this.chatBookingId, "", "", this.messageDetails.minderId,
                                        this.messageDetails.ownerid)

                                    this.api.showToast(res.message, 2000, 'bottom');
                                    this.goToMessages()
                                } else {
                                    this.api.showToast(res.message, 2000, 'bottom');
                                    this.goToMessages()
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, this.message.id);
                            });
                    }
                }
            ]
        }); await alert.present();
    }

    async meetandGreetAwesome(bookingId) {
        const alert = await this.alertController.create({
            header: 'Great! Thanks for letting us know your Meet & Greet went well!',
            subHeader: 'We will now process a payment for this booking on your card so that your booking is confirmed. A receipt will be sent to your email address. All bookings are covered with Pet Sitter Liability Insurance up to $5M.',
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',

                }, {
                    text: 'Ok',
                    handler: (data) => {
                        this.api.showLoader();
                        this.api.meetandgreetwentwell(this.message.id)
                            .subscribe((res: any) => {
                                this.api.hideLoader();
                                if (res.success) {
                                    this.analytics.logEvent(PetcloudApiService.meetgreetwell, { userId: this.userId });
                                    this.api.showToast(res.message, 2000, 'bottom');
                                    this.appsFlyerAnalytics("MD", bookingId, "", res.actualrevenue, this.messageDetails.minderId, this.messageDetails.ownerid)
                                    this.bookingSuccessModel();
                                } else {
                                    this.api.showToast(res.message, 2000, 'bottom');

                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, bookingId);
                            });
                    }
                }
            ]
        }); await alert.present();
    }

    async bookingSuccessModel() {
        const modal = await this.model.create({
            component: BookingSuccessComponentComponent,
            animated: true,
            componentProps: {
                bookingId: this.messageDetails.id,
            },
        });
        modal.onDidDismiss().then((data: any) => {
            this.model.dismiss("modelCloseWithRefresh");
        });
        return await modal.present();
    }

    async declineBooking(bookingID, messageDetail) {
        const modal = await this.modalCtrl.create({
            component: OwnerDeclineBookingComponent,
            animated: true,
            componentProps: {
                id: bookingID,
                messageDetails: messageDetail
            }

        });
        modal.onDidDismiss()
            .then((data) => {
                if (data.role == 'success') {
                    if (this.onlyProfile) {
                        this.getInfo(this.chatBookingId);
                    } else {
                        this.goToMessages();
                    }
                }
            });
        return await modal.present();
    }


    async modifyBooking(bookingID) {
        const modal = await this.modalCtrl.create({
            component: ModifyBookingComponent,
            animated: true,
            componentProps: {
                id: bookingID,
                details: this.messageDetails.modify_details
            }

        });
        modal.onDidDismiss()
            .then((data: any) => {
                if (data.data == 'yes') {
                    if (this.onlyProfile) {
                        this.getInfo(this.chatBookingId);
                    } else {
                        this.goToMessages();
                    }
                }
            });
        return await modal.present();
    }

    async cancelBooking(id, messageDetail) {

        const modal = await this.modalCtrl.create({
            component: RequestCancellationComponent,
            animated: true,
            componentProps: {
                id: this.chatBookingId,
                messageDetails: messageDetail
            }

        });
        modal.onDidDismiss()
            .then((data) => {
                if (data.role == 'success') {
                    if (this.onlyProfile) {
                        this.getInfo(this.chatBookingId);
                    } else {
                        this.goToMessages();
                    }
                }
            });
        return await modal.present();
    }

    async meetandGreet(id, status) {
        const modal = await this.modalCtrl.create({
            component: MeetandGreetComponentComponent,
            animated: true,
            componentProps: {
                id: this.chatBookingId, // BookingID
                isMeetandGreetEdit: status
            }

        });
        modal.onDidDismiss()
            .then((data: any) => {
                this.goToMessages()
            });
        return await modal.present();
    }

    shareFacebook() {
        this.api.shareViaFb("If you love pets, why not sign up to PetCloud, you can either become a Pet Sitter or book a Pet Sitter! Click here to find out more info:", null, null);
    }

    googleMap(lat, lng) {
        this.router.navigate(['/location-map', {
            lat: lat,
            lng: lng, locationName: this.mapAddress
        }]);
    }


    async addtoCalender() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Calender',
            buttons: [{
                text: 'Apple',
                icon: 'logo-apple',
                handler: () => {
                    let target = "_blank";
                    this.api.openExteralLinks(this.messageDetails.addToCalenderApple);
                }
            }, {
                text: 'Google',
                icon: 'logo-google',
                handler: () => {
                    this.api.openExteralLinks(this.messageDetails.addToCalenderGoogle);
                }
            }, {
                text: 'Outlook',
                icon: 'mail-open',
                handler: () => {
                    this.api.openExteralLinks(this.messageDetails.addToCalenderOutlook);
                }
            }, {
                text: 'Outlook.com',
                icon: 'mail-open',
                handler: () => {
                    this.api.openExteralLinks(this.messageDetails.addToCalenderOutlookcom);
                }
            }, {
                text: 'Yahoo',
                icon: 'logo-yahoo',
                handler: () => {
                    this.api.openExteralLinks(this.messageDetails.addToCalenderYahoo);
                }
            }
                , {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel'
            }]
        });
        await actionSheet.present();
    }

    protected setJobCountDown() {
        const countDownInterval = interval(1000);

        countDownInterval.subscribe((val) => {
            this.dateTimeDifference();
        });
    }

    async leaveReview() {
        const modal = await this.modalCtrl.create({
            component: LeaveaReviewComponent,
            animated: true,
            componentProps: {
                id: this.message.id, // BookingID
                messageDetails: this.messageDetails
            }

        });
        modal.onDidDismiss()
            .then((data: any) => {

                this.goToMessages();
                //this.router.navigateByUrl("home/tabs/messages");
            });
        return await modal.present();
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

    onRadioButtonChecked(id, index) {
        this.inspectionDateIndex = index;

        this.messageDetails.meetngreet.inspection_dates.forEach(element => {
            if (element.id == index) {
                element.checked = true
            } else {
                element.checked = false
            }
        });
    }

    goToWidrawal() {
        this.navCntl.navigateRoot('/withdrawal');
    }

    public async makeCall(contactNumber) {


        const alert = await this.alertController.create({
            header: '',
            subHeader: 'Would you like to make a call?',
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Ok',
                    handler: (data) => {

                        this.callNumber.callNumber(contactNumber, true)
                            .then(res => console.log('Launched dialer!', res))
                            .catch(err => console.log('Error launching dialer', err));
                    }
                }
            ]
        }); await alert.present();

    }


    public meetandGreetConfrimDates(bookingId, index) {
        const bookingDetail: any = { bookingId: this.chatBookingId, id: this.inspectionDateIndex };
        this.api.showLoader();
        this.api.mindermeetngreetdate(bookingDetail)
            .subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                    this.api.showToast(res.message, 2000, 'bottom');
                    this.goToMessages()
                } else {
                    this.api.showToast(res.message, 2000, 'bottom');
                    this.goToMessages()
                }
            }, (err: any) => {
                this.api.autoLogout(err, bookingDetail);
            });
    }


    public async petDetails(pet) {
        const petdescription = [];
        petdescription.push(pet)
        const modal = await this.modalCtrl.create({
            component: PetDetailsComponent,
            animated: true,
            componentProps: {
                petDetails: petdescription,
            }

        });
        // modal.onDidDismiss()
        //     .then((data: any) => {
        //         console.log(data);
        //     });
        return await modal.present();
    }

    public paypalAuth(total, bookingId) {

        this.api.showToast("We will release paypal payments in next version of App", "3000", "bottom");

        return false;
    }


    public acceptOrCancelBooking(value) {
        if (value == 1) {
            this.showHideMeetGreetButton = true;

        } else {
            this.showHideMeetGreetButton = false;
            this.deleteBooking();
        }
        // If Value is 0 then cancel Booking 1 for Accept Booking.
    }

    public async alterBookingCost(cost) {

        const modal = await this.modalCtrl.create({
            component: AlterBookingCostComponent,
            animated: true,
            componentProps: {
                id: this.message.id,
                cost: this.messageDetails.negotiated == 0 || null ? cost : this.messageDetails.negotiated
            }
        });
        modal.onDidDismiss()
            .then(async (data: any) => {

                this.goToMessages();
            });
        return await modal.present();
    }

    public async meetandGreetNotGreat(bookingId) {
        const modal = await this.modalCtrl.create({
            component: MeetngreetNotSoGreatComponent,
            animated: true,
            componentProps: {
                id: this.message.id,
                messageDetails: this.messageDetails,
            }
        });
        modal.onDidDismiss()
            .then((data: any) => {
                this.goToMessages()
            });
        return await modal.present();
    }

    public getInfo(messageId) {

        this.storage.get(PetcloudApiService.USER).then((user: User) => {
            if (user != null) {
                this.userId = user.id;
                this.userData = user;
                user.paypal_email != null || user.stripeCardId != null ? this.paymentVeried = true : this.paymentVeried = false
                this.getMessageDetails(messageId);
            }
        }, err => {

        })
    }

    downloadPDF() {
        let downloadUrl = this.messageDetails.meetngreetguide;
        let path = this.file.dataDirectory;
        this.api.showLoader();
        const transfer = this.ft.create();
        transfer.download(downloadUrl, path + 'myfile.pdf').then(entry => {
            let url = entry.toURL();
            this.api.hideLoader();
            if (this.platform.is('ios')) {
                this.document.viewDocument(url, 'application/pdf', {});
            } else {
                this.fileOpener.open(url, 'application/pdf')
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
            }
        });
    }


    shareNo(event) {
        event.detail.checked == true ? this.isNumberShare = true : this.isNumberShare = false;
    }

    agreeTC(event) {
        event.detail.checked == true ? this.isCheckedTC = true : this.isCheckedTC = false;
    }


    async chatScreen() {
        let otherUserImage;
        let toName = this.messageDetails.minder.first_name == this.userData.first_name ? this.messageDetails.owner.first_name : this.messageDetails.minder.first_name
        let sendPush = this.messageDetails.minder.first_name == this.userData.first_name ? this.messageDetails.owner.sendMePush : this.messageDetails.minder.sendMePush
        otherUserImage = this.messageDetails.owner.imagename == this.userData.imagename ? this.messageDetails.minder.imagename : this.messageDetails.owner.imagename;


        const modal = await this.modalCtrl.create({
            component: ChatscreenComponent,
            animated: true,
            componentProps: {
                id: this.chatBookingId,
                minderId: this.messageMinderId,
                ownerId: this.messageOwnerId,
                userId: this.userData.id,
                currentUserImage: this.userData.imagename,
                otherUserImage,
                fromName: this.userData.first_name,
                toName,
                sendPush,
                dropOff: this.pickUpDate,
                pickUp: this.pickEndDate,
                serviceName: this.messageDetails.service.serviceType.serviceName,
                amount: this.messageDetails.service.total,
                bookingStatus: this.messageDetails.booking_status
            }
        });
        modal.onDidDismiss()
            .then((data: any) => {
                this.getMessageDetails(this.chatBookingId);
            });
        return await modal.present();
    }

    goToMessages() {
        if (this.onlyProfile) {
            this.model.dismiss();
        } else {
            this.navcntl.navigateRoot("home/tabs/messages");
        }
    }

    openBrowser(url) {
        this.api.openExteralLinks(url);
    }

    appsFlyerAnalytics(bookingStatus, bookingId, potentional_revenue, actual_revenue, minderId, owenerId) {
        const booking = {
            af_booking_status: bookingStatus,
            af_booking_id: bookingId,
            af_minder_id: minderId,
            af_owner_id: owenerId,
            af_potentional_revenue: potentional_revenue,
            af_actual_revenue: actual_revenue
        }
        this.appsFlyerService.bookingEvent(booking);
    }
}