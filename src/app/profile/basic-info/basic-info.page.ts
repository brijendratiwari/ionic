import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { PetcloudApiService } from './../../api/petcloud-api.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { User } from '../../model/user';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { NavController, ModalController, Platform } from '@ionic/angular';
// import model files
import { ApiResponse } from '../../model/api-response';
import { finalize } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { InfomodelComponent } from '../../components/infomodel/infomodel.component';
import { AppsFlyerService } from '../../../app/apps-flyer.service';
import { Events } from 'src/app/events';
import { OtpVerificationPage } from '../../otp-verification/otp-verification.page';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.page.html',
    styleUrls: ['./basic-info.page.scss'],
})
export class BasicInfoPage implements OnInit {
    public verify_code: any;
    public profileForm: FormGroup;
    public gender: any;
    public imageSrc: String = '';
    public isNDISParticant: boolean = false;
    requestForGPSPremission: boolean = true;

    @ViewChild('places') places: GooglePlaceDirective;
    @ViewChild('search') public searchElement: ElementRef;
    public lat = ""
    public lng = "";
    public userData: User;
    public showManagerEmail: boolean = false;

    options = {
        types: ['(regions)'],
        componentRestrictions: { country: "AU" },
        bounds: null,
        fields: null,
        strictBounds: null,
        origin: null
    };


    constructor(public api: PetcloudApiService, private formBuilder: FormBuilder,
        public EPEvent: Events,
        public geoLocation: Geolocation,
        protected router: Router, protected storage: Storage,
        private diagnostic: Diagnostic,
        private locationAccuracy: LocationAccuracy,
        public modalCtrl: ModalController,
        public appsFlyerAnalytics: AppsFlyerService,
        protected navCtrl: NavController,
        public platform: Platform,) {

    }

    ngOnInit() {
        this.profileForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            gender: [''],
            user_type: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            street_address: ['', [Validators.required]],
            address: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
            mobile: ['', [Validators.required, Validators.pattern(/^(\+61)[0-9]{9}$/)]],
            phone: [''],
            ndis_participant: [false],
            plan_managed: ['1'],
            plan_manager_email: ['']
        });
    }

    ionViewDidEnter() {
        // fill up form with already stored value by user profile
        this.getUserProfileBasicInfo();
    }


    //Check if application having Location Authorization
    async isLocationAuthorized() {
        await this.platform.ready();
        this.diagnostic.isLocationEnabled().then((isEnabled: any) => {
            if (isEnabled) {
                this.diagnostic.isLocationAuthorized().then((success: any) => {
                    if (success) {
                        this.requestForGPSPremission = true;
                        this.getLocationAccuracy();
                    } else {
                        this.requestForGPSPremission = false;
                    }
                }, err => {
                })
            } else {
                this.requestForGPSPremission = false;
            }

        }, err => {
        })
    }

    async getLocationAccuracy() {
        await this.platform.ready();
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (response_gps) => {
                // When GPS Turned ON call method to get Accurate location coordinates
                this.getCurrentLocation();
            },
            error => {
            }
        );
    }

    async getCurrentLocation() {
        await this.geoLocation.getCurrentPosition().then(async (resp) => {

            this.lat = await resp.coords.latitude.toString()
            this.lng = await resp.coords.longitude.toString();

            await this.api.getSuburb(this.lat, this.lng).subscribe(async (response: any) => {
                this.profileForm.patchValue({
                    address: response.locality
                })
            }, async err => {

            })
        });
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
                    phone_number: res.phone_number,
                    'type': 'basic-info'
                }
            });
            modal.onDidDismiss()
                .then((data: any) => {
                    console.log(data);
                    this.verify_code = data.data.code;
                    if (data.data.type == 'basic-info') {
                        this.saveBasicProfile();
                    }
                });
            return await modal.present();
        }, err => {
            this.api.autoLogout(err, "");
        })
        // this.nav.navigateForward(['/otp-verification'])
    }
    public saveBasicProfile() {
        this.profileForm.value.lat = this.lat;
        this.profileForm.value.lng = this.lng;
        this.profileForm.value.verify_code = this.verify_code
        if (!this.profileForm.value.ndis_participant) {
            this.profileForm.value.ndis_participant = 0
            this.profileForm.value.plan_managed = ""
            this.profileForm.value.plan_manager_email = ""
        } else {
            this.profileForm.value.ndis_participant = 1
        }

        this.api.showLoader();
        this.api.updateUserProfile(this.profileForm.value).pipe(
            finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe(async (res: ApiResponse) => {
                if (await res.success) {
                    await this.storage.set("email", this.profileForm.value.email);
                    await this.storage.set("isLoggedInKeyPressed", true);

                    const analytics = {
                        user_status: "LoggedIn",
                        user_id: res.user.id,
                        app_version: this.appsFlyerAnalytics.getCurrentVersionCode(),
                        app_type: this.appsFlyerAnalytics.platformName(),
                    }
                    this.appsFlyerAnalytics.profileUpdatedAnalytics(analytics);
                    let user_type = await this.profileForm.value.user_type;

                    if (user_type == 3 || user_type == 2) {
                        this.storage.set("menuType", "sitter").then((res) => {
                            localStorage.setItem("menuType", "sitter")
                            this.EPEvent.publish("menuName", { menuType: "sitter", time: Date.now() })
                        })
                    } else if (user_type == 1) {
                        localStorage.setItem("menuType", "owner")
                        this.storage.set("menuType", "owner").then((res) => {
                            this.EPEvent.publish("menuName", { menuType: "owner", time: Date.now() })
                        })
                    }

                    this.EPEvent.publish("isProfileUpdated", { status: true, time: Date.now() });

                    this.storage.set(PetcloudApiService.USER, res.user);
                    this.api.showToast('Your profile has been saved successfully', 2000, 'bottom');


                    setTimeout(() => {
                        this.router.navigateByUrl('/profile-photo-upload');
                    }, 800);
                } else {
                    this.api.showToast(res.error, 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.autoLogout(err, this.profileForm.value)
            });
    }

    /**
     * Get User Profile Basic Information for Profile 1st Step.
     */
    public getUserProfileBasicInfo() {
        this.api.showLoader();
        this.api.getUserBasicProfile().pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe(async (res: ApiResponse) => {
            if (res.success) {
                const userData: User = await res.user;
                const ndisProfile: any = await userData.ndisprofile

                this.profileForm.setValue({
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    gender: userData.gender,
                    user_type: userData.user_type,
                    dob: (userData.dob === '1970-01-01' || userData.dob == null) ? new Date() : userData.dob,
                    street_address: userData.street_address,
                    address: userData.address,
                    state: userData.state,
                    zipcode: userData.zipcode,
                    mobile: userData.mobile,
                    phone: userData.phone,
                    ndis_participant: ndisProfile && ndisProfile.ndis_participant == "1" ? true : false,
                    plan_managed: ndisProfile != null ? ndisProfile.plan_managed : "",
                    plan_manager_email: ndisProfile != null ? ndisProfile.plan_manager_email : "",
                });

                if (ndisProfile != null) {
                    if (ndisProfile.plan_managed == "2" && this.isNDISParticant) {
                        this.showManagerEmail = true
                    } else {
                        this.showManagerEmail = false
                    }

                } else {
                    this.showManagerEmail = false
                }

                this.lng = userData.longitude;
                this.lat = userData.latitude;


                if (this.lat == null || this.lat == "") {
                    this.isLocationAuthorized();
                }
            } else {
                this.api.showToast('Getting problem to fetch profile details', 2000, 'bottom');
            }
        }, (err: any) => {
            this.api.autoLogout(err, "")

        });
    }

    public handleAddressChange(address: any) {

        const addressArray = address.formatted_address.split(' ');
        const addressLenth = addressArray.length;
        let addressText = '';

        for (let i = 0; i < (addressLenth - 2); i++) {
            addressText += addressArray[i] + '';
        }
        // set automatice state and pincode value
        this.profileForm.patchValue({
            address: address.vicinity,
            state: this.getState(addressArray[(addressLenth - 2)]),
            zipcode: (isNaN(addressArray[(addressLenth - 1)])) ? '' : addressArray[(addressLenth - 1)]
        });
        this.lng = address.geometry.location.lng();
        this.lat = address.geometry.location.lat();
    }

    isReadonly(val) {
        if (val != undefined && val.length > 0) {
            return true
        } else {
            return false
        }
    }
    private getState(stateName: string): any {
        switch (stateName) {
            case 'ACT':
                return '1';
                break;
            case 'NSW':
                return '2';
                break;
            case 'NT':
                return '3';
                break;
            case 'QLD':
                return '4';
                break;
            case 'SA':
                return '5';
                break;
            case 'VIC':
                return '6';
                break;
            case 'WA':
                return '7';
                break;
            case 'TAS':
                return '8';
                break;
            default:
                return '0';
        }
    }

    async infoModel(type) {
        const modal = await this.modalCtrl.create({
            component: InfomodelComponent,
            animated: true,
            cssClass: 'modalCss',
            componentProps: {
                type
            }
        });
        modal.onDidDismiss()
            .then((data: any) => {

            });
        return await modal.present();
    }

    onChangeNDISParticipant(ev) {
        ev.detail.checked == true ? (this.isNDISParticant = true, this.showManagerEmail = true) : (this.isNDISParticant = false, this.showManagerEmail = false)
    }

    planType(event) {
        if (event.detail.value == 2) {
            this.showManagerEmail = true
        } else {
            this.showManagerEmail = false
        }
    }
}
