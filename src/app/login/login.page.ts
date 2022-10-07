import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import {
  MenuController,
  Platform,
  NavController,
  AlertController,
} from "@ionic/angular";
// facebook lib for login
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { ApiResponse } from "../model/api-response";
import { AuthenticationService } from '../services/authentication.service';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { finalize } from 'rxjs/operators';
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AnalyticsService } from "../analytics.service";
import { AppsFlyerService } from "../apps-flyer.service";
import { Events } from "../events";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  // to send this in api request
  public userData = {
    LoginForm: {
      username: "",
      password: "",
      androidId: "",
      iPhoneId: "",
    },
  };
  public showLoginGroup = null;
  public androidFCM: any;
  public iphoneFCM: any;
  public fbLogin: any = { email: "" };
  public isLoggedInChecked: boolean = true;

  passwordType: string = "password";
  passwordIcon: string = "eye-off";

  // store form object with key | value pair
  public loginData: any;
  // manage form in page
  public loginForm: FormGroup;
  public platformName: any = "";
  public loginCount: any = 0;


  constructor(
    public events: Events,
    public api: PetcloudApiService,
    private formBuilder: FormBuilder,
    protected storage: Storage,
    private fb: Facebook,
    public navCntl: NavController,
    protected router: Router,
    public sideMenu: MenuController,
    public platform: Platform,
    public fba:AnalyticsService,
    public alertController: AlertController,
    public authService: AuthenticationService,
    private signInWithApple: SignInWithApple,
    public googlePlus: GooglePlus,
    public appFlyerAnalytics:AppsFlyerService,

  ) {
    this.backButtonEvent();
    // disable side menu on login page
    this.sideMenu.enable(false);
  }

  ngOnInit() {
    this.loginCount = 0;
    this.platform.is("android") ? this.platformName =  "android" : this.platformName = "ios";
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      androidId: [""],
      iPhoneId: [""],
    });

    this.storage.get("email").then((res) => {
      if (res != null || res != undefined || res != "") {
        this.loginForm.patchValue({
          username: res,
        });
      }
    });

    this.storage.get("password").then((res) => {
      if (res != null || res != undefined || res != "") {
        this.loginForm.patchValue({
          password: res,
        });
      }
    });    
  }

  public async loginUser() {
    await this.api.showLoader();
    let signInData = {
      LoginForm: {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        androidId:"",
        iPhoneId: "",
      },
    };

    if (this.platform.is("cordova")) {
      const deviceId = await this.api.getFirebaseToken()
      signInData = {
        LoginForm: {
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
          androidId: deviceId.androidId,
          iPhoneId: deviceId.iPhoneId,
        },
      };
    }
    this.doLogin(signInData);
  }

  public async isLoggedIn(event) {
    event.detail.checked == true
      ? (this.isLoggedInChecked = true)
      : (this.isLoggedInChecked = false);

    if (!this.isLoggedInChecked) {
      await this.storage.set("email", "");
      await this.storage.set("password", "");
    }
  }

   appFlyerLog = (user_id,login_first_date,login_last_date) => {    
     const analytics = {
      user_id,
      login_first_date,
      login_last_date,
      login_count:this.loginCount,
      app_version:this.appFlyerAnalytics.getCurrentVersionCode(),
      app_type:this.appFlyerAnalytics.platformName()}  

      // Apps Flyer
      this.appFlyerAnalytics.loginAnalytics(analytics)  
    }



  public doLogin(signInData) {
    this.loginCount = this.loginCount + 1;
    this.api.loginUser(signInData).subscribe(
      async (res: ApiResponse) => {
        // hide loader in success
        this.api.hideLoader();
        if (res.success === true) {
          // check token is received or user data received
          if (res.user && res.token) {
            const userId = res.user.id;
            this.fba.logEvent(PetcloudApiService.app_login_analytics,{userId});
            this.authService.authState.next(true);
            this.storage.set("isLoggedInKeyPressed", this.isLoggedInChecked);
            this.storage.set("password", this.loginForm.value.password);
            this.storage.set(PetcloudApiService.USERTOKEN, res.token);
            localStorage.setItem("token", res.token);
            localStorage.setItem("notificationToken", res.notificationToken);

            this.events.publish("token",res.token),
            this.events.publish("user", res.user);

           await this.appFlyerLog(res.user.id,res.login_first_date,res.login_last_date);
            
          
            let background: any = res.user.BackgroundCheck;
            let rightToWork: any = res.user.righttowork;
            let animalCare: any = res.user.animalcare;

            let is_verified = background.is_verified;
            let is_workVerified = rightToWork.is_verified;
            let is_animalcare = animalCare.is_verified;

            is_verified == this.api.VERIFIED ? (res.user.isBackgroundChecked = true) : (res.user.isBackgroundChecked = false);
            is_workVerified == this.api.VERIFIED ? (res.user.isRightToWorkChecked = true) : (res.user.isRightToWorkChecked = false);
            is_animalcare == this.api.VERIFIED ? (res.user.isAnimalCareChecked = true) : (res.user.isAnimalCareChecked = false);

            await this.storage.set(PetcloudApiService.USER, res.user);

            let user_type = await res.user.user_type;
 
            if (user_type == 3 || user_type == 2) {
              localStorage.setItem("menuType", "sitter")
              this.storage.set("menuType", "sitter").then((res) => {
                this.events.publish("menuName", {menuType: "sitter", time: Date.now()})
              })
            } else if (user_type == 1) {
              localStorage.setItem("menuType", "owner")
              this.storage.set("menuType", "owner").then((res) => {
               
              })
            }

            await this.api.addTokenInHeader();

            let getReturnurl: any = await this.api.checkisNewUser(res.user);
           
            if (res.user.longitude == null || res.user.longitude == "") {
              this.navCntl.navigateRoot([
                "/basic-info",
                { backBtn: true },
              ]);
            } else if (res.user.imagename == null || res.user.imagename == "") {
              this.router.navigate([
                "/profile-photo-upload",
                { backBtn: true },
              ]);
            }

            else if ((await getReturnurl) == "/profile-photo-upload") {
              this.navCntl.navigateRoot([
                "/profile-photo-upload",
                { backBtn: true },
              ]);
            } else {

              if (getReturnurl != null) {
                this.navCntl.navigateRoot(await getReturnurl);
              }
            }
          } else {
            this.api.showToast("check your login details", 2000, "bottom");
          }
        } else {
          // Email Exist then take user to Reset Password Page.
          if(res.emailExist){
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
                      this.navCntl.navigateRoot("/reset-password");
                  }
                }
              ]
            });
            await alert.present();
          } else if(!res.emailExist){
            const alert = await this.alertController.create({
              message: "This Email address is not linked to PetCloud, Sign up Instead.",
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                }, {
                  text: 'Okay',
                  handler: () => {
                    this.navCntl.navigateRoot("/signup-user");
                  }
                }
              ]
            });
            await alert.present();
           
          }else{
            this.api.showToast(res.error,'3000',"bottom");
          }
        }
      },
      (err) => {
        this.api.autoLogout(err,signInData)
        // hide loader in error
        this.api.hideLoader();
      }
    );
  }

  public async loginWithApple(){

    if(this.platform.is("ios")){
    await  this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      }).then(async (res: AppleSignInResponse) => {
      
        const deviceData = await this.api.getFirebaseToken()
        const deviceId = {
          androidId: deviceData.androidId,
          iPhoneId:deviceData.iPhoneId,
          token:res.identityToken,
        }

       this.api.showLoader();
      await this.api.loginWithapple(deviceId).subscribe(
        async (r: ApiResponse) => {
          this.api.hideLoader();
          if (r.success === true) {
            if (r.user && r.token) {
              await this.storage.set(PetcloudApiService.USERTOKEN, r.token);
              localStorage.setItem("token", await r.token);
              this.events.publish("token",r.token),
           await this.storage.set(PetcloudApiService.USER, r.user);
           deviceId.androidId != "" ? this.appFlyerAnalytics.registerToken(deviceId.androidId) :
                  this.appFlyerAnalytics.registerToken(deviceId.iPhoneId)
                  
           await this.api.checkIsNewUser().then(async (dynamicUrl: any) => {
                await  this.navCntl.navigateRoot(dynamicUrl);
              });
            }
          } else {
            this.api.showToast(r.error,3000,"bottom");
          }
        },
        (err: any) => {
          this.api.hideLoader();
          this.api.autoLogout(err,deviceId)
        }
      );
    }).catch((error: AppleSignInErrorResponse) => {
        error.code === 1001? "" : this.api.showToast("This device does not support Apple SignIn, try updating your device","3000","bottom")
      });
  
    }else{
      this.api.showToast("Apple Sign In is available for iOS device.","3000","bottom")  
    }
  }

  public facebookLogin() {
    // show loader
    this.api.showLoader();

    // the permissions your facebook app needs from the user
    const permissionsArr = ["public_profile", "email"];

    this.fb
      .login(permissionsArr)
      .then(async (res: FacebookLoginResponse) => {

        const deviceData = await this.api.getFirebaseToken()
        const deviceId = {
          androidId:deviceData.androidId,
          iPhoneId: deviceData.iPhoneId,
          token: await res.authResponse.accessToken
      }
        this.api.loginWithFacebook(deviceId).subscribe(
          (r: ApiResponse) => {
            this.api.hideLoader();
            if (r.success === true) {
              if (r.user && r.token) {
                this.storage.set(PetcloudApiService.USERTOKEN, r.token);
                localStorage.setItem("token", r.token);

                this.events.publish("token",r.token),
                  deviceId.androidId != "" ? this.appFlyerAnalytics.registerToken(deviceId.androidId) :
                  this.appFlyerAnalytics.registerToken(deviceId.iPhoneId)
                    
                this.storage.set(PetcloudApiService.USER, r.user);
                this.api.checkIsNewUser().then((dynamicUrl: any) => {
                  this.navCntl.navigateRoot(dynamicUrl);
                });
              } else {
                this.api.showToast(
                  "User is not logged in by Facebook! Try again",
                  2000,
                  "bottom"
                );
              }
            } else {
              this.api.showToast(
                "User is not logged in by Facebook! Try again",
                2000,
                "bottom"
              );
            }
          },
          (err: any) => {
            this.api.hideLoader();
            this.api.showToast(
              "User is not logged in! Try Again",
              2000,
              "bottom"
            );
          }
        );
      })
      .catch((e: any) => {
        this.api.hideLoader();
        this.api.showToast("Error logging into Facebook", 2000, "bottom");
      });
  }

  // Hardware Back Button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
      if (this.router.url === "/login") {
        if (
          new Date().getTime() - this.api.lastTimeBackPress <
          this.api.timePeriodToExit
        ) {
          navigator["app"].exitApp(); // work in ionic 4
        } else {
          this.api.showToast("Press agin to exit app", 2000, "bottom");
          this.api.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  goBack() {

    let viewPetJob = localStorage.getItem("viewPetJobs");
    let trainingDone = localStorage.getItem(PetcloudApiService.TRAININGDONE);
    this.storage.clear();
    localStorage.clear();

    viewPetJob == "yes" ? localStorage.setItem("viewPetJobs", "yes") : "";
    trainingDone == "yes" ? localStorage.setItem(PetcloudApiService.TRAININGDONE, "yes") : "";
    
    this.router.navigateByUrl('/home/tabs/sitter-listing')
  }

  toggleLogin(group) {
    if (this.isLoginShown(group)) {
      this.showLoginGroup = null;
    } else {
      this.showLoginGroup = group;
    }
  }


  isLoginShown(group) {
    return this.showLoginGroup === group
  }

  public facebookSignup() {

    const permissionsArr = ['public_profile', 'email'];

    this.fb.login(permissionsArr)
      .then(
        async (res: FacebookLoginResponse) => {
          this.api.showToast('Sign up successful with Facebook.', 2000, 'bottom');
          this.api.showLoader();
  
          const deviceData = await this.api.getFirebaseToken()
          const deviceId = {
            androidId:deviceData.androidId,
            iPhoneId:deviceData.iPhoneId
          }

          await this.api.signupWithFacebook(res.authResponse.accessToken,deviceId)
            .pipe(finalize(() => {
              // hide loader in success
            }))
            .subscribe(
              (r: ApiResponse) => {
              if (r.success) {
                  this.api.showToast('Authentication successful, login now.', 2000, 'bottom');
                  // add redirection code to login user.
                  this.storage.set(PetcloudApiService.USERTOKEN, r.token);
                  localStorage.setItem('token', r.token);
                  deviceId.androidId != "" ? this.appFlyerAnalytics.registerToken(deviceId.androidId) :
                  this.appFlyerAnalytics.registerToken(deviceId.iPhoneId)
                  this.events.publish("token",r.token),
                  
                  this.api.addTokenInHeader();
                  this.storage.set(PetcloudApiService.USER, r.user);
                  this.api.showLoader();
                  this.api.checkIsNewUser()
                    .then((dynamicUrl: any) => {
                     
                      this.router.navigateByUrl(dynamicUrl);
                      this.api.hideLoader();
                    });
                  // this.router.navigateByUrl('/home');
                } else {
                  this.api.hideLoader();
                  if (r['errorNo'] == 31) {
                    this.api.showToast(r.error, 2000, 'bottom');
                  } else {
                    this.api.showToast('Error please contact service@petcloud.com.au and we will assist you', 2000, 'bottom');
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

    this.storage.clear();
    localStorage.clear();
    
    this.storage.set("isLoggedInKeyPressed", false);

    this.router.navigateByUrl("//home/tabs/sitter-listing");
  }

  public async loginWithGoogle(){

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
              // hide loader in success
           
          })).subscribe(async (data: any) => {
              if (data.success) {
                  this.storage.set(PetcloudApiService.USERTOKEN, data.token);
                  localStorage.setItem('token', data.token);
                  this.api.addTokenInHeader();
                  this.storage.set(PetcloudApiService.USER, data.user);

                  deviceId.androidId != "" ? this.appFlyerAnalytics.registerToken(deviceId.androidId) :
                  this.appFlyerAnalytics.registerToken(deviceId.iPhoneId)
                  
                  await this.api.checkIsNewUser()
                      .then((dynamicUrl: any) => {
                          this.router.navigateByUrl(dynamicUrl);
                          this.api.hideLoader();
                      });
              } else {
                this.api.hideLoader();
                  this.api.showToast(data.error, 3000, "bottom");
              }

          }, err => {
              this.api.autoLogout(err, userData);
          })
      }).catch(err => console.error(err));
  }

}
