import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Validators, FormBuilder, FormGroup, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";


// importing model files
import { ApiResponse } from '../../model/api-response';
import { User } from '../../model/user';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { CameraService } from '../../../app/camera-service.service';

@Component({
    selector: 'app-payout-prefrence',
    templateUrl: './payout-prefrence.page.html',
    styleUrls: ['./payout-prefrence.page.scss'],
})
export class PayoutPrefrencePage implements OnInit {

    public stripeFrm: FormGroup;
    public paypalFrm: FormGroup;
    public selectedSegment = '';
    public backButton: any = "";
    public isStripeAccountAdded: boolean = false;
    public documentContainer: boolean = false;

    constructor(public api: PetcloudApiService,
        private formBuilder: FormBuilder,
        protected router: Router,
        public navCntl: NavController,
        public plt: Platform,
        public CameraAPI: CameraService,
        public camera: Camera,
        public actionSheetCtrl: ActionSheetController,
        public route: ActivatedRoute,
        protected storage: Storage) {

        this.backButton = this.route.snapshot.paramMap.get("backBtn");

        this.backButtonEvent();
    }

    ngOnInit() {
        this.stripeFrm = this.formBuilder.group({
            accountNumber: ['', [Validators.required]],
            accountName: ['', [Validators.required]],
            bsb: ['', [Validators.required]]
        });
        this.paypalFrm = this.formBuilder.group({
            paypal_email: ['', [Validators.required, Validators.email]]
        });
        this.selectedSegment = 'stripe';
    }

    ionViewDidEnter() {
        this.isStripeAccountAdded = false;
        this.storage.get(PetcloudApiService.USER)
            .then(async (userData: User) => {
                if (userData != null) {
                    await this.checkVerificationPending(userData)
                    if (userData.account) {
                        this.isStripeAccountAdded = true;
                        this.stripeFrm.patchValue({
                            accountName: userData.account.data[0].account_holder_name,
                            bsb: userData.account.data[0].routing_number,
                            accountNumber: "xxxxx " + userData.account.data[0].last4
                        })
                    } else {
                        this.isStripeAccountAdded = false;
                    }
                    userData.stripe_connect_update != null ? this.documentContainer = true : this.documentContainer = false;

                    this.paypalFrm.setValue({
                        paypal_email: userData.paypal_email
                    });
                }
            });
    }


    async checkVerificationPending(userData) {
        if (userData.user_type == 2 || userData.user_type == 3) {
            await this.api.isVerificationPendingModel();
        } else if (userData.user_type == 1) {
            if (userData.verified == 0 || userData.verify_phoneflag == "N") {
                await this.api.isVerificationPendingModel();
            }
        }
    }

    isReadonly(val) {
        if (val != undefined && val.length > 0) {
            return true
        } else {
            return false
        }
    }
    async stripeDocumentUpload(pageSide) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select Photo From',
            buttons: [{
                text: 'Camera',
                handler: () => {

                    this.photoOption(this.camera.PictureSourceType.CAMERA, pageSide);
                }
            }, {
                text: 'Gallery',
                handler: async () => {
                    const status = await this.CameraAPI.checkPhotoLibraryPermission();
                    if (status) {
                        this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY, pageSide);
                    }
                }
            }, {
                text: 'Cancel',

            }]
        });
        await actionSheet.present();
    }

    photoOption(params, pageSide) {

        this.CameraAPI.getPicture(params).then((base64String: any) => {
            this.imageUpload('data:image/jpeg;base64,' + base64String, pageSide);
        }, err => {

        })

    }


    imageUpload(base64String, pageSide) {
        const fileParams = { image: base64String, file_name: "Imagename.jpg", pageside: pageSide };
        this.api.showLoader();
        this.api.uploadDocumentForBank(fileParams).pipe(
            finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res.success) {
                    this.navCntl.navigateRoot('/home/tabs/profile-menu')
                    this.api.showToast('Document Uploaded.', 2000, 'bottom');

                } else {
                    this.api.showToast('Filed to add document.', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.autoLogout(err, fileParams)
            });
    }

    /**
     * Update Paypal email
     */
    public updatePaypal() {
        this.api.showLoader();
        const user = {
            'Users': {
                paypal_email: this.paypalFrm.value.paypal_email
            }
        };
        this.api.updatePaypal(user)
            .subscribe((res: any) => {
                if (res.success) {
                    // now update local user details
                    this.api.getUserBasicProfile()
                        .pipe(finalize(() => {
                            this.api.hideLoader();
                        }))
                        .subscribe(async (apiRes: ApiResponse) => {
                            if (apiRes.success) {
                                await this.storage.set(PetcloudApiService.USER, apiRes.user);
                                this.navCntl.navigateRoot('/home/tabs/profile-menu')
                                this.api.showToast('payment details updated successful', 2000, 'bottom');
                            } else {
                                this.api.showToast('User Payment details not updated in application, Please Try again to update!',
                                    3000, 'bottom');
                            }
                        }, (err: any) => {

                            this.api.showToast('User Payment details not updated in application, Please Try again to update!',
                                3000, 'bottom');
                            this.navCntl.navigateRoot('/home/tabs/profile-menu')

                        });
                } else {
                    this.navCntl.navigateRoot('/home/tabs/profile-menu')
                    this.api.showToast(res.error, 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.showToast(err, 3000, 'bottom');
                this.api.autoLogout(err, user)
            });
    }

    /**
     * Update Stripe Details
     */
    public updateStripe() {

        const bankFrm = {
            'BankForm': this.stripeFrm.value
        };


        this.api.showLoader();
        this.api.updateStripeDetails(bankFrm)
            .pipe(finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((apiRes: ApiResponse) => {
                if (apiRes.success) {
                    this.storage.set(PetcloudApiService.USER, apiRes.user);
                    this.documentContainer = true;
                    this.isStripeAccountAdded = true;
                    this.api.showToast('Details updated', 2000, 'bottom');
                } else {
                    this.navCntl.navigateRoot('/home/tabs/profile-menu')
                    this.api.showToast(apiRes.error, 4000, 'bottom');
                }
            }, (err: any) => {
                this.api.showToast(err, 3000, 'bottom');
                this.api.autoLogout(err, bankFrm)
            });
    }


    backButtonNavigate() {
        if (this.backButton) {
            this.router.navigateByUrl('/home/tabs/jobs-tab')
        } else {
            this.navCntl.pop();
        }
    }



    // active hardware back button
    backButtonEvent() {
        this.plt.backButton.subscribe(async () => {
            this.api.dismissModelorAlert();
            if (this.router.url === '/payout-preference') {
                if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                    navigator['app'].exitApp();
                } else {
                    this.api.showToast('Press again to exit app.', 2000, "bottom");
                    this.api.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    }

}
