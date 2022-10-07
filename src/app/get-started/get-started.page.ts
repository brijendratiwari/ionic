import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController, Platform, NavController, ModalController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { FastcoComponent } from '../fastco/fastco.component';
import { AppleSignInErrorResponse, AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { finalize } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AppsFlyerService } from '../apps-flyer.service';

@Component({
    selector: 'app-get-started',
    templateUrl: './get-started.page.html',
    styleUrls: ['./get-started.page.scss'],
})
export class GetStartedPage implements OnInit {

    public platformName: any = "";
    isAccepted: boolean = false;

    constructor(public api: PetcloudApiService, protected router: Router,
        private fb: Facebook,
        protected storage: Storage,
        protected modalCtrl: ModalController,
        public sideMenu: MenuController,
        public navCtrl: NavController,
        public platform: Platform,
        public appsFlyerAnalytics:AppsFlyerService,
        private googlePlus: GooglePlus,
        private signInWithApple: SignInWithApple) {
        this.sideMenu.enable(false);
    }

    ngOnInit() {
        this.platform.is("android") ? this.platformName = "android" : this.platformName = "ios";
    }

    public facebookSignup() {
        if(!this.checkTermsAccepted()) {
            return;
        }
        const permissionsArr = ['public_profile', 'email'];
        this.fb.login(permissionsArr)
            .then(
                async (res: FacebookLoginResponse) => {
                    this.api.showToast('Authenticate successful with Facebook,Now login your User.', 2000, 'bottom');
                    this.api.showLoader();


                    const deviceId = await this.api.getFirebaseToken();
  
                    await this.api.signupWithFacebook(res.authResponse.accessToken, deviceId)
                        .pipe(finalize(() => {
                            // hide loader in success
                            
                        }))
                        .subscribe(
                            (r: ApiResponse) => {
                                if (r.success) {
                                    this.api.showToast('User is signup successful with Petcloud.', 2000, 'bottom');
                                    // add redirection code to login user.
                                    this.storage.set(PetcloudApiService.USERTOKEN, r.token);
                                    localStorage.setItem('token', r.token);
                                    this.api.addTokenInHeader();
                                    this.storage.set(PetcloudApiService.USER, r.user);

                                    deviceId.androidId != "" ? this.registerToken(deviceId.androidId) : this.registerToken(deviceId.iPhoneId)
                                    // this.navCtrl.navigateRoot('/home', {skipLocationChange: true})
                                    // check user is new or not
                                    this.api.checkIsNewUser()
                                        .then((dynamicUrl: any) => {
                                            this.router.navigateByUrl(dynamicUrl);
                                            this.api.hideLoader();
                                            // this.navCtrl.navigateRoot('/home', {skipLocationChange: true});
                                        });
                                    // this.router.navigateByUrl('/home');
                                } else {
                                    this.api.hideLoader();
                                    if (r['errorNo'] == 31) {
                                        this.api.showToast(r.error, 2000, 'bottom');
                                    } else {
                                        this.api.showToast(r.error, 2000, 'bottom');
                                    }
                                }
                            }, (err: any) => {
                                this.api.hideLoader();
                                this.api.showToast('having some trouble for signup your user! Try Again', 2000, 'bottom');
                            });
                }).catch((e: any) => {
                    this.api.hideLoader();
                    this.api.showToast('Error logging into Facebook', 2000, 'bottom');
                });
    }

    public continueGuest(){

        if(!this.checkTermsAccepted()) {
            return;
        }
        this.storage.clear();
        localStorage.clear();
        this.storage.set("isLoggedInKeyPressed", false);

        this.router.navigateByUrl("/home/tabs/sitter-listing");
      }

      public registerToken(token){
        this.appsFlyerAnalytics.registerToken(token);
      }

    async googleSignUp() {

        if(!this.checkTermsAccepted()) {
            return;
        }
        const deviceId = await this.api.getFirebaseToken();
        let userData = {
            user_id: "",
            email: "",
            first_name: "",
            last_name: "",
            androidId: deviceId.androidId,
            iPhoneId: deviceId.iPhoneId
        }
        this.googlePlus.login({}).then((res) => {
            this.api.showLoader();
            userData.email = res.email,
                userData.first_name = res.givenName,
                userData.last_name = res.familyName,
                userData.user_id = res.userId

            this.api.authWithGoogle(userData).pipe(finalize(() => {
            })).subscribe(async (data: any) => {
                if (data.success) {
                    this.storage.set(PetcloudApiService.USERTOKEN, data.token);
                    localStorage.setItem('token', data.token);
                    this.api.addTokenInHeader();
                    this.storage.set(PetcloudApiService.USER, data.user);

                    userData.androidId != "" ? this.registerToken(userData.androidId) : this.registerToken(userData.iPhoneId);
                    await this.api.checkIsNewUser()
                        .then((dynamicUrl: any) => {
                            this.router.navigateByUrl(dynamicUrl);
                            this.api.hideLoader();
                        });
                } else {
                    this.api.showToast(data.error, 3000, "bottom");
                    this.api.hideLoader();
                }

            }, err => {
                this.api.autoLogout(err, userData);
            })
        }).catch(err => console.error(err));
    }

    appleSignup() {
        if(!this.checkTermsAccepted()) {
            return;
        }
        if (this.platform.is('ios')) {
            this.signInWithApple.signin({
                requestedScopes: [
                    ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
                    ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
                ]
            })
                .then(async (res: AppleSignInResponse) => {

                    const firebaseDevicetoken = await this.api.getFirebaseToken();
                    const deviceDetails = {
                        androidId: firebaseDevicetoken.androidId,
                        iPhoneId: firebaseDevicetoken.iPhoneId,
                        first_name: res.fullName.givenName,
                        last_name: res.fullName.familyName
                    }

                    this.api.showLoader();
                    await this.api.signupWithApple(res.identityToken, deviceDetails)
                        .pipe(finalize(() => {
                         
                        }))
                        .subscribe(
                            (r: ApiResponse) => {
                                if (r.success) {
                                    
                                    deviceDetails.androidId != "" ? this.registerToken(deviceDetails.androidId) : this.registerToken(deviceDetails.iPhoneId);
                                    this.api.showToast('User is signup successful with Petcloud.', 2000, 'bottom');
                                    // add redirection code to login user.
                                    this.storage.set(PetcloudApiService.USERTOKEN, r.token);
                                    localStorage.setItem('token', r.token);
                                    this.api.addTokenInHeader();
                                    this.storage.set(PetcloudApiService.USER, r.user);


                                    // check user is new or not
                                    this.api.checkIsNewUser()
                                        .then((dynamicUrl: any) => {
                                            this.router.navigateByUrl(dynamicUrl);
                                            this.api.hideLoader();
                                         
                                        });
                                    // this.router.navigateByUrl('/home');
                                } else {
                                    this.api.hideLoader();
                                    this.api.showToast(r.error, 3000, "bottom");
                                }
                            }, (err: any) => {
                                this.api.autoLogout(err, deviceDetails)
                            });
                }).catch((e: any) => {
                    this.api.hideLoader();
                    
                })
                .catch((error: AppleSignInErrorResponse) => {
                    error.code === 1001 ? "" : this.api.showToast("This device does not support Apple SignIn, try updating your device", "3000", "bottom")
                });
        } else {
            this.api.showToast("Apple Sign In is available for iOS device.", "3000", "bottom")
        }

    }

    async fastCo() {
        const modal = await this.modalCtrl.create({
            component: FastcoComponent,
            animated: true,
            componentProps: {
            }

        });
        modal.onDidDismiss()
            .then((data: any) => {
            });
        return await modal.present();
    }

    // Hardware Back Button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            this.api.dismissModelorAlert();
            if (this.router.url === '/get-started') {
                if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                    navigator['app'].exitApp(); // work in ionic 4
                } else {
                    this.api.showToast('Press agin to exit app', 2000, 'bottom');
                    this.api.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    }

    goBack() {
        this.router.navigateByUrl('/login')
    }

    openAgreement() {
      this.api.openExteralLinks(this.api.AGREEMENT_LINK);
    }

    gotoSignup() {
        if(!this.checkTermsAccepted()) {
            return;
        }
        this.router.navigateByUrl('/signup-user');
    }

    checkTermsAccepted() {
        if(!this.isAccepted) {
            this.api.showToast('Please accept terms to register', 2000, 'bottom');
        }
        return this.isAccepted;
    }
}
