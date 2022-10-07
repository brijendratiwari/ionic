import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AlertController, MenuController, NavController, Platform} from '@ionic/angular';

// import model files
import {ApiResponse} from './../model/api-response';
import {finalize} from 'rxjs/operators';
import { AppsFlyerService } from '../apps-flyer.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
    selector: 'app-signup-user',
    templateUrl: './signup-user.page.html',
    styleUrls: ['./signup-user.page.scss'],
})
export class SignupUserPage implements OnInit {

    public androidFCM: any;
    public iphoneFCM: any;
    public isPasswordMatch: boolean = true
    // to send this in api request
    public userData = {
        RegisterForm: {
            first_name: '',
            email: '',
            password: '',
            androidId: [""],
            iPhoneId: [""],
            mobile:[""],
        }
    };

    // store form object with key | value pair
    public signupData: any;
    // manage form in page
    public signupForm: FormGroup;

    // store skip welcome value
    public skipWelcome: any;

    /**
     *
     * @param api PetcloudApiService
     * @param formBuilder FormBuilder for input validation
     */
    constructor(public api: PetcloudApiService, private formBuilder: FormBuilder,
                protected router: Router,protected storage: Storage,
                public sideMenu: MenuController,
                public navcntl: NavController,
                private firebase: FirebaseX,
                public alertController: AlertController,
                public appFlyerAnalytics:AppsFlyerService,
                public platform: Platform) {
                // disable side menu on signup page.
                this.sideMenu.enable(false);
    }

    ngOnInit() {
        this.signupForm = this.formBuilder.group({
            first_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            reTypePassword: ['', [Validators.required]],
        });
    }

    appFlyerLog = (user_id) => {   
        const analytics = {
            user_id,
            signup_date:this.appFlyerAnalytics.dateFormat(),
            session_number:"",
            session_id:"",app_version:this.appFlyerAnalytics.getCurrentVersionCode(),
            app_type:this.appFlyerAnalytics.platformName()
        }
        this.appFlyerAnalytics.singupAnalytics(analytics)    
    }

    isPassMatch() {
        return (this.signupForm.value.password === this.signupForm.value.reTypePassword)
    }

    public async signupUser() {

        if(this.signupForm.value.password != this.signupForm.value.reTypePassword){
            this.isPasswordMatch = false;
        }else{
            this.isPasswordMatch = true;
            await this.platform.ready();
            await this.firebase.getToken().then((token: any) => {
                if (this.platform.is("android")) {
                  this.androidFCM = token;
                  localStorage.setItem("fcmToken", this.androidFCM);
                } else if (this.platform.is("ios")) {
                  this.iphoneFCM = token;
                  localStorage.setItem("fcmToken", this.iphoneFCM);
                }
            });
    
            // show loading
            this.api.showLoader();
            this.signupData = this.signupForm.value;
            this.userData.RegisterForm.first_name = this.signupData.first_name;
            this.userData.RegisterForm.password = this.signupData.password;
            this.userData.RegisterForm.email = this.signupData.email;
            this.userData.RegisterForm.mobile = this.signupData.mobile;
            this.userData.RegisterForm.androidId = this.androidFCM;
            this.userData.RegisterForm.iPhoneId = this.iphoneFCM;
        
            this.api.signupUser(this.userData).pipe(
                finalize(() => {
                    this.api.hideLoader();
                })
            ).subscribe(async (res: ApiResponse) => {
                // hide loader in success
                if (res.success) {
                    this.api.showToast('signup successful', 2000, 'bottom');
                    this.storage.set(PetcloudApiService.USERTOKEN, res.token);
                    localStorage.setItem('token', res.token);
                    this.storage.set(PetcloudApiService.USER, res.user);
                    this.api.addTokenInHeader();
                
                    this.appFlyerLog(res.user.id);
    
                    this.api.checkIsNewUser()
                        .then(async (dynamicUrl: any) => {
                            await this.storage.set(PetcloudApiService.SKIPWELCOME,true);
                            await  this.storage.set("email", this.signupForm.value.email);
                            await  this.storage.set("password", this.signupForm.value.password);
                            await  this.storage.set("isLoggedInKeyPressed", true);
                            await  this.router.navigateByUrl(await dynamicUrl);
                        });
                } else {
    
                    if(res.emailPhoneRegisted){
                        const alert = await this.alertController.create({
                            message: res.error,
                            buttons: [
                              {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'secondary',
                              }, {
                                text: 'Okay',
                                handler: () => {
                                    this.navcntl.navigateRoot("/login");
                                }
                              }
                            ]
                          });
                          await alert.present();    
                    }else{
                        this.api.showToast(res.error, 2000, 'bottom');
                    }
                }
            }, (err: any) => {
                // hide loader in error
                
                this.api.autoLogout(err,"")
            });
        }
    }

    /**
     * checking confirm password validation using this function and set formGroup object to invalid
     */
    public passwordConfirm(): boolean {
        if (this.signupForm.get('password').value !== this.signupForm.get('reTypePassword').value) {
            this.signupForm.controls['reTypePassword'].setErrors({'incorrect': true});
            return true;
        } else {
            return false;
        }
    }

    // Hardware Back Button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            this.api.dismissModelorAlert();
            if (this.router.url === '/login') {
                if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                  
                    navigator['app'].exitApp(); // work in ionic 4
                } else {
                    this.api.showToast('Press agin to exit app', 2000, 'bottom');
                    this.api.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    }
}
