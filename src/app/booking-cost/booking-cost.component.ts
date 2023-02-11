import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Market } from '@ionic-native/market/ngx';
import { User } from '../model/user';
import { AnalyticsService } from '../analytics.service';
import { AppsFlyerService } from '../apps-flyer.service';

@Component({
    selector: 'app-booking-cost',
    templateUrl: './booking-cost.component.html',
    styleUrls: ['./booking-cost.component.scss'],
})
export class BookingCostComponent implements OnInit {
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

    constructor(public modalCtrl: ModalController, protected storage: Storage, public api: PetcloudApiService,
        private platform: Platform, private alertController: AlertController,
        private market: Market,
        public modal: ModalController,
        public analytics: AnalyticsService,
        public appsFlyerAnalytics: AppsFlyerService,
        private datepipe: DatePipe, protected router: Router, public navcntl: NavController) {
    }

    ngOnInit() {
        this.sendBookingInquiryButton = false;
        this.storage.get('bookingCost')
            .then(async (cost: any) => {
                this.costData = await cost;
                let minBookingPrice = this.costData.bookingfee.minPrice;
                let maxBookingPrice = this.costData.bookingfee.maxPrice;

                if (this.costData.total >= 400) {
                    this.bookingCost = parseFloat(maxBookingPrice);
                    this.totalCost = parseFloat(this.costData.total) + parseFloat(maxBookingPrice);
                } else {
                    this.bookingCost = (this.costData.total * minBookingPrice);
                    this.totalCost = (this.costData.total * minBookingPrice) + parseFloat(this.costData.total);
                }
                this.totalCost = this.totalCost + 1
            });


        this.storage.get(PetcloudApiService.USER)
            .then((userData: any) => {
                this.userData = userData;
            });

        this.api.hideLoader();
    }

    ionViewWillLeave() {
    }
    ionViewDidLeave() {
    }

    public dismissModal() {
        this.modalCtrl.dismiss();
    }


    public async sendBookingRequest() {

        if (this.shareNumber && this.termsAccpted) {
            this.storage.get('BookingRequestForm')
                .then((bookingForm: any) => {

                    let endDate = bookingForm['end_date'];
                    endDate == "" || null || undefined ? "" : this.datepipe.transform(new Date(Date.parse(bookingForm['end_date'])), 'EEE d MMM y')
                    bookingForm['start_date'] = this.datepipe.transform(new Date(Date.parse(bookingForm['start_date'])), 'EEE d MMM y');
                    bookingForm['end_date'] = endDate;
                    bookingForm['couponCode'] = this.coupneCode;
                    bookingForm['donationagree'] = this.isRSPCADonationChecked ? 1 : 0;
                    bookingForm['donationamount'] = this.isRSPCADonationChecked ? 1 : "";

                    const BookingForm = {
                        'BookingRequestForm': bookingForm,
                        'share-number': 1,
                    };
                    this.sendBookingInquiryButton = true
                    // send booking request

                    this.api.showLoader();
                    this.api.sendBookingRequestForm(BookingForm).pipe(finalize(() => {
                        // hide loader in success
                        this.api.hideLoader();
                    })).subscribe(async (res: any) => {
                        if (res.success) {

                            const booking = {
                                af_booking_status: "P",
                                af_booking_id: res.bookingId,
                                af_minder_id: bookingForm.minderid,
                                af_owner_id: this.appsFlyerAnalytics.userid,
                                af_potentional_revenue: "",
                                af_actual_revenue: "",
                            }

                            this.appsFlyerAnalytics.bookingEvent(booking);

                            await this.storage.get(PetcloudApiService.USER).then(async (user: User) => {
                                this.analytics.logEvent(PetcloudApiService.direct_inquiry, { userId: user.id });
                            })

                            this.api.showToast('Request sent successfully', 2000, 'bottom');
                            this.storage.set('bookingId', res.bookingId);
                            console.log('response from', res);

                            if (this.userData.app_review == 0) {
                                this.appRating();
                            } else {
                                this.router.navigateByUrl('/home/tabs/messages');
                            }

                        } else {
                            this.sendBookingInquiryButton = false;
                            this.api.showToast('Request Booking Failed', 2000, 'bottom');
                        }


                    }, (err: any) => {
                        this.sendBookingInquiryButton = false
                        this.api.showToast(err.message, 2000, 'bottom');
                        this.api.autoLogout(err, BookingForm);
                    });
                })
        } else {
            this.api.showToast('please select Share number and terms', 2000, 'bottom');
        }

    }

    async appRating() {
        const alert = await this.alertController.create({
            header: 'Booking Request Sent!',
            cssClass: 'booking-request-sent',
            subHeader: 'What do you think of the PetCloud App?',
            buttons: [
                {
                    text: 'I love it!',
                    handler: async (data) => {
                        this.confirmationRatingPopup()      
                    }
                }, {
                    text: 'Could improve',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.appSuggestionAlert();
                    }
                }
            ]
        });
        await alert.present();
    }
    async confirmationRatingPopup() {
        var header;
        if (this.platform.is("android")) {
          header = 'Could you please leave us a Rating on the Play Store?'
          } else {
            header = 'Could you please leave us a Rating on the App Store?' 
          }
        const alert = await this.alertController.create({
            subHeader: header,
            cssClass: 'booking-request-sent',
            buttons: [
                {
                    text: 'Ok!',
                    handler: (data) => {
                        this.api.showLoader();
                        const appRate = {
                            status: 1
                        }

                        this.api.showLoader();
                        this.api.rateAPP(appRate).subscribe(async (res: any) => {
                            this.api.hideLoader();

                            await this.storage.get(PetcloudApiService.USER).then(async (user: User) => {
                                user.app_review = 1
                                await this.storage.set(PetcloudApiService.USER, user);
                            })

                            if (this.platform.is("android")) {
                                this.router.navigateByUrl('/home/tabs/messages');
                                this.market.open('com.petcloud.petcloud');
                            } else {
                                this.router.navigateByUrl('/home/tabs/messages');
                                this.market.open('id1539909889');
                            }
                        }, err => {
                            this.api.autoLogout(err, appRate);
                        })
                    }
                }, {
                    text: 'Maybe Later',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        // this.router.navigateByUrl('/home/tabs/messages');
                    }
                },
            ]
        });
        await alert.present();
    }


    async appSuggestionAlert() {
        const alert = await this.alertController.create({
            subHeader: 'Sorry, what can we do to improve?',
            cssClass: 'booking-request-sent',
            buttons: [
                {
                    text: 'Give Suggestions',
                    handler: (data) => {

                        this.sendFeedbackEmail();
                    }
                }, {
                    text: 'No thanks',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.router.navigateByUrl('/home/tabs/messages');
                    }
                },
            ]
        });
        await alert.present();
    }

    public isRSPCADonation(event) {
        this.isRSPCADonationChecked = event.detail.checked
        event.detail.checked ? this.totalCost = this.totalCost + 1 : this.totalCost = this.totalCost - 1;
    }

    async sendFeedbackEmail() {
        this.api.sendEmailtoAccounts("support@petcloud.com.au", ["kirtan.p@shaligraminfotech.com"], "Pet Cloud app review", "")
    }

    closeBottomDrawer() {
        this.sendBookingRequestClick = false;
    }
}
