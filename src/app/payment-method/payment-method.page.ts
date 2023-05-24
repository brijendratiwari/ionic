import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../model/user';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Stripe } from '@ionic-native/stripe/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
// import {PayPal, PayPalConfiguration} from '@ionic-native/paypal/ngx';
import { NavController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.page.html',
    styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {
    public paypal_email: String = '';
    public stripeDefaultid: any;
    public stripeDefaultCheck: Boolean = false;
    public creditCardFrm: FormGroup;
    public backButton: any = "";

    constructor(protected storage: Storage, public iab: InAppBrowser, public api: PetcloudApiService, private stripe: Stripe,
        public navCntl: NavController, public router: Router,
        public plt: Platform, public route: ActivatedRoute,
        private formBuilder: FormBuilder,
        // private paypal: PayPal
    ) {


        // this.backButtonEvent();

    }

    ngOnInit() {
        this.getInfo();
        this.storage.get(PetcloudApiService.USER)
            .then((userData: User) => {
                this.paypal_email = userData.paypal_email;
            });
        this.creditCardFrm = this.formBuilder.group({
            cardName: ['', [Validators.required]],
            cardNumber: ['', [Validators.required, Validators.maxLength(16), Validators.pattern('[0-9]+$')]],
            cardMonth: ['', [Validators.required]],
            cardYear: ['', [Validators.required]],
            cardCcv: ['', [Validators.required, Validators.maxLength(4), Validators.pattern('[0-9]+$')]]
        });
    }

    backButtonNavigate() {
        if (this.backButton) {
            this.router.navigateByUrl('/home/tabs/sitter-listing')
        } else {
            this.navCntl.pop();
        }
    }

    ionViewDidEnter() {

        this.backButton = this.route.snapshot.paramMap.get("backBtn");

        this.storage.get(PetcloudApiService.USER)
            .then(async (res: User) => {

                let stripeData: any = res.stripe;
                let public_key = await stripeData.public_key;
                this.stripe.setPublishableKey(public_key);


                this.getCard();

                if (res.user_type == 2 || res.user_type == 3) {

                    if (res.verified == 0 || res.verify_phoneflag == "N" || !res.isBackgroundChecked ||
                        !res.isRightToWorkChecked || !res.isAnimalCareChecked) {
                        await this.api.isVerificationPendingModel();

                    }
                } else if (res.user_type == 1) {
                    if (res.verified == 0 || res.verify_phoneflag == "N") {
                        await this.api.isVerificationPendingModel();

                    }
                }

                else {
                    this.getCard();

                }
            })
    }

    getCard() {
        this.storage.get(PetcloudApiService.STRIPECARD)
            .then((cardData: any) => {
                if (cardData != null && cardData !== '') {
                    this.creditCardFrm.setValue({
                        cardName: cardData.name,
                        cardNumber: 'xxxxxxxxxxxx' + cardData.last4,
                        cardMonth: cardData.exp_month < 9 ? 0 + cardData.exp_month.toString() :
                            cardData.exp_month.toString(),
                        cardYear: cardData.exp_year,
                        cardCcv: ''
                    });
                }
            });
    }

    /**
     * set stripe default payment mehtod.
     * @param ev event of field
     */
    public setDefaultMethod(ev) {
        if (this.stripeDefaultCheck === true) {
            this.stripeDefaultid = 1;
        } else {
            this.stripeDefaultid = '';
        }
    }

    /**
     * Save card in stripe using api
     */
    public saveCardInStripe() {
        var cardNumber = this.creditCardFrm.value.cardNumber;
        const card = {
            number: this.creditCardFrm.value.cardNumber,
            name: this.creditCardFrm.value.cardName,
            expMonth: this.creditCardFrm.value.cardMonth,
            expYear: this.creditCardFrm.value.cardYear,
            cvc: this.creditCardFrm.value.cardCcv
        };


        this.api.showLoader();
        this.stripe.createCardToken(card)
            .then((token: any) => {
                if (token) {
                    // send details in stripe
                    const cardFrm = {
                        'post_type': 'add_card',
                        'redirect': '',
                        'stripeDefault': '',
                        'stripeToken': token.id,
                        'card_number': cardNumber
                    };

                    console.log('cardFrm..............', cardFrm)
                    this.creditCardFrm.setValue({
                        cardName: token.card.name,
                        cardNumber: 'xxxxxxxxxxxx' + token.card.last4,
                        cardMonth: token.card.exp_month,
                        cardYear: token.card.exp_year,
                        cardCcv: ''
                    });
                    console.log(cardNumber, "cardNumber");
                    this.api.updateCardInStripe(cardFrm)
                        .pipe(finalize(() => {
                            this.api.hideLoader();
                        }))
                        .subscribe((res: any) => {
                            if (res.success) {

                                this.storage.set(PetcloudApiService.STRIPECARD, token.card);
                                this.api.showToast('card details updated in stripe', 2000, 'bottom');
                                this.navCntl.navigateRoot('/home/tabs/profile-menu')
                            } else {
                                this.api.showToast(res.error, 2000, 'bottom');
                            }
                        }, (err: any) => {
                            this.api.autoLogout(err, cardFrm)
                        });
                } else {
                    this.navCntl.navigateRoot('/home/tabs/profile-menu')
                    this.api.showToast('card details not updated in stripe, Please try again!', 3000, 'bottom');
                }
            })
            .catch((error: any) => {
                this.api.hideLoader();
                this.api.showToast(error, 3000, 'bottom');

            });
    }

    /**
     * convert number to array
     * @param num pass number
     */
    public getCardYears() {
        const today = new Date();
        const startYear = today.getFullYear();
        const endYear = (today.getFullYear() + 30);
        const yearArr = [];
        for (let i = startYear; i <= endYear; i++) {
            yearArr.push(i);
        }
        return yearArr;
    }

    public connectPaypal() {
        this.api.showToast("We will release paypal payments in next version of App", "3000", "bottom");
    }

    openStripeBilling() {
        let browser = this.iab.create('https://billing.stripe.com/p/login/4gwdS42Sr4FW3qE4gg', '_blank', 'location=yes');    //This will open link in InAppBrowser
           
            browser.on('loadstart').subscribe((event: InAppBrowserEvent) => { })
    }

    getInfo() {
        this.storage.get(PetcloudApiService.USER).then((user: User) => {
            console.log(user.stripe_card);

            if (user.stripe_card != false) {

                this.creditCardFrm.patchValue({
                    cardName: user.stripe_card.name,
                    cardNumber: 'xxxxxxxxxxxx' + user.stripe_card.last4,
                    cardMonth: user.stripe_card.exp_month < 9 ? 0 + user.stripe_card.exp_month.toString() : user.stripe_card.exp_month.toString(),
                    cardYear: user.stripe_card.exp_year,
                    cardCcv: ''
                })
            }
        })
    }
}
