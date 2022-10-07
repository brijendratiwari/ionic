 import { Component, OnInit, NgZone } from "@angular/core";
import { PetcloudApiService } from "./../../api/petcloud-api.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
// import model files
import { ApiResponse } from "../../model/api-response";
import { User } from "../../model/user";
import { finalize } from "rxjs/operators";
import {
  NavController,ActionSheetController,Platform,
  LoadingController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { Subscription } from "rxjs/Subscription";
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { CameraService } from "../../camera-service.service";
import { Camera} from "@ionic-native/camera/ngx";
@Component({
  selector: "app-profile-email-verify",
  templateUrl: "./profile-email-verify.page.html",
  styleUrls: ["./profile-email-verify.page.scss"],
})
export class ProfileEmailVerifyPage implements OnInit {
  public verifyForm: FormGroup;
  public isPhoneVerified: boolean;
  public isEmailVerified: any;
  public userPhoneNo: any;
  shownBackGroundGroup = null;
  shownNurseCertGroup = null;
  shownYellowCardGroup = null;
  shownAnimalCare= null;
  showTaxiGroup = null;
  shownRightToWork = null;
  shownNDISGroup: null;
  userData: any;
  verificationResponse: any;
  backgroundCheckResponse: any;
  myImageUrl: any;
  documentType: any;
  public righttowork: any;
  public licenseImage = {front:"", back:""};

  private onResumeSubscription: Subscription;


  isEmailVerify: boolean;
  isPhoneVerify: boolean;
  isBackgroundcheck: boolean;
  isanimalCare: boolean;

  OTP: string = "";
  OTPmessage: string =
    "An OTP is sent to your number. You should receive it in 15 s";
  isCalenderUpdated: boolean = false;
  backButton: any = "";
  private sub1$: any;

  public smsTextmessage: string = '';
  public appHashString: string = '';

  constructor(
    public navCtrl: NavController,
    public api: PetcloudApiService,
    private formBuilder: FormBuilder,
    private fb: Facebook,
    public actionSheetCtrl: ActionSheetController,
    public router: Router,
    protected storage: Storage,
    public androidPermissions: AndroidPermissions,
    public plt: Platform,
    public backgroundMode: BackgroundMode,
    public loading: LoadingController,
    public modal: ModalController,
    public route: ActivatedRoute,
    public ngZone: NgZone,
    public socialSharing: SocialSharing,
    public alertController: AlertController,
    public platform: Platform,
    public cameraAPI:CameraService,
    public camera: Camera,
    public model:ModalController
  ) {

    this.backButtonEvent();
    this.backButton = this.route.snapshot.paramMap.get("backBtn");
    
  }


  async ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      verifyCode: ["", [Validators.required]],
    });

    this.storage.get(PetcloudApiService.USER).then((data: any) => {

      this.verifyForm.setValue({
        mobileNumber: data.mobile,
        verifyCode: "",
      });
    });
    

 
    this.checkVerification();
    this.onResumeSubscription = this.plt.resume.subscribe(() => {
      // do something meaningful when the app is put in the foreground
      this.ngZone.run(() => {
        this.checkVerification();
      });
    });
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {    
  }

  ionViewWillUnload() {
    if (this.sub1$) {
      this.sub1$.unsubscribe();
    }
  }
  
  backButtonNavigate() {
    this.router.navigateByUrl("/home/tabs/sitter-listing");
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
  }



  public sendVerificationCodeToEmail() {
    this.api.showLoader();
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        this.api
          .sendVerificationCodeToEmail(userData.email)
          .pipe(
            finalize(() => {
              this.api.hideLoader();
              // this.api.showToast('something went wrong! please Try again.', 2000, 'bottom');
            })
          )
          .subscribe((res: ApiResponse) => {
            if (res.success) {
              this.api.showAlert(
                "Verify Email",
                "Your verification email has been " +
                  "sent successfully. Please check your inbox for instructions to verify your email address",
                [
                  {
                    text: "Ok",
                    handler: () => {
                    },
                  },
                ]
              );
            } else {
              this.api.showToast(
                "Verification email not sent! Try again.",
                2000,
                "bottom"
              );
            }
          });
      },
      (err: any) => {
        this.api.autoLogout(err,"");
      }
    );
  }

  /**
   * Send Verification code for mobile number verification
   */
  public async sendVerificationCodeForMobile() {
   
    const hashCode = {
      hashCode: this.appHashString
    }

    let phone = btoa(this.verifyForm.value.mobileNumber);
    this.api.showLoader();
    this.api
      .sendVerificationCodeForMobile(phone,hashCode)
      .subscribe(
        (res: ApiResponse) => {
          this.api.hideLoader();
          if (res.success) {
            this.api.showAlert(
              "Mobile number verification",
              "Verification code sent successfully",
              [
                {
                  text: "Ok",
                  handler: () => {},
                },
              ]
            );
          } else {
            this.api.showToast(
              "verification code not sent! Try again.",
              2000,
              "bottom"
            );
          }
        },
        (err: any) => {
          this.api.hideLoader();
          this.api.showToast(
            "verification code not sent! Try again.",
            2000,
            "bottom"
          );
        }
      );
  }

  public verifyCodeForMobile() {
    if (
      this.verifyForm.value.verifyCode === "" ||
      this.verifyForm.value.verifyCode == null
    ) {
      this.api.showToast(
        "please provide verification code first.",
        2000,
        "bottom"
      );
    } else {
      this.api.showLoader();
      this.api.verifyCodeForMobile(this.verifyForm.value.verifyCode).subscribe(
        (res: ApiResponse) => {
          this.api.hideLoader();
          if (res.success) {
            this.isPhoneVerified = true;
            this.storage
              .get(PetcloudApiService.USER)
              .then(async (userData: User) => {
                userData.verify_phoneflag == "N"
                  ? (userData.verify_phoneflag = "Y")
                  : "";
                // update user object
                await this.storage.set(PetcloudApiService.USER, userData);

                await this.getInfo();
              });

            if (this.isEmailVerify && this.isPhoneVerified) {
              this.router.navigateByUrl("/home/tabs/profile-menu");
              this.api.showToast(
                "Your Mobile number is verified successful.",
                2000,
                "bottom"
              );
            } else if (this.isPhoneVerify && this.isEmailVerify == false) {
              this.api.showToast(
                "Your Mobile number is verified successful, Please verify Email Now.",
                2000,
                "bottom"
              );
            }
          } else {
            this.api.showToast(
              "Your Mobile number is not verified! Try again.",
              2000,
              "bottom"
            );
          }
        },
        (err: any) => {
          this.api.autoLogout(err,"");
          this.api.showToast(
            "Your Mobile number is not verified! Try again.",
            2000,
            "bottom"
          );
        }
      );
    }
  }

  toggleVerification(group) {
    if (this.isVerificationGroupShown(group)) {
      this.shownBackGroundGroup = null;
    } else {
      this.shownBackGroundGroup = group;
    }
  }

  toggleRightToWork(group) {
    if (this.isRighToWork(group)) {
      this.shownRightToWork = null;
    } else {
      this.shownRightToWork = group;
    }
  }

  isRighToWork(group) {
    return this.shownRightToWork === group;
  }

  togleNurseCert(group) {
    if (this.isNurseCertGroupShown(group)) {
      this.shownNurseCertGroup = null;
    } else {
      this.shownNurseCertGroup = group;
    }
  }

  togglePetTaxi(group) {
    console.log(group);
    if (this.isPetTaxiGroupShow(group)) {
      this.showTaxiGroup = null;
    } else {
      this.showTaxiGroup = group;
    }
  }

 
  toggleNIDSCard(group) {
    if (this.isNDISGroupShown(group)) {
      this.shownNDISCardGroup = null;
    } else {
      this.shownNDISCardGroup = group;
    }
  }

  
  isNDISGroupShown(group) {
    return this.shownNDISCardGroup === group;
  }

  shownNDISCardGroup(group) {
    return this.shownNDISGroup === group;
  }

  isVerificationGroupShown(group) {
    return this.shownBackGroundGroup === group;
  }
  isNurseCertGroupShown(group) {
    return this.shownNurseCertGroup === group;
  }
  isPetTaxiGroupShow(group) {
    return this.showTaxiGroup === group;
  }

  async getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      (res: User) => {
        this.userPhoneNo = res.mobile;
        this.isPhoneVerified = res.verify_phoneflag == "N" ? false : true;
        this.isEmailVerified = res.verified == 0 ? false : true;
        this.isBackgroundcheck = res.isBackgroundChecked == false ? false : true;
        this.righttowork = res.isRightToWorkChecked = false ? false : true;
        this.isanimalCare = res.isAnimalCareChecked = false ? false : true;
        this.checkVerification();
      },
      (err) => {
        
      }
    );
  }

  // Check Verification
  async checkVerification() {
     this.api.showLoader();
    this.api
      .checkVerification()
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          this.api.hideLoader();
          this.verificationResponse = await res;

          this.isEmailVerified = res.emailVerify.status == "1" ? true : false;
          this.isPhoneVerified = res.phoneVerify.verify_phoneflag == "Y" ? true : false;
          this.isBackgroundcheck = res.BackgroundCheck.is_verified == "Verified" ? true : false;
          this.righttowork =res.righttowork.is_verified == "Verified" ? true : false;
          this.isanimalCare = res.animalcare.is_verified == "Verified" ? true : false;
          this.licenseImage.front = res.DriversLicence.document_image;
          this.licenseImage.back = res.DriversLicence.document_image_back;
          
          this.storage.get(PetcloudApiService.USER).then((user: User) => {
            let background: any = user.BackgroundCheck;
            let righttowork: any = user.righttowork
            let animalcare:any = user.animalcare;
            
            if(this.isPhoneVerified){
              user.verify_phoneflag = "Y"
            }
        
           if(this.isEmailVerified){
            user.verified = 1
           
          }
          
           if(this.isBackgroundcheck == true){
            background.is_verified = "Verified"; 
            user.backgroundCheckDocument = true;
           }

           if(this.righttowork){
            user.isRightToWorkChecked = true;
            righttowork.is_verified = "Verified";
           }

           if(this.isanimalCare){
            user.isAnimalCareChecked = true;
            animalcare.is_verified = "Verified";
           }
           
            this.storage.set(PetcloudApiService.USER, user);
          });
        },
        (err) => {
          this.api.hideLoader();
          this.api.autoLogout(err,"");
        }
      );
  }



  backgroundCheck() {
    this.api.showLoader();
    this.api
      .backgroundCheck()
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          this.backgroundCheckResponse = res;
          if (res.success) {
            this.api.showToast(res.message, "2000", "bottom");
            this.api.openExteralLinks(res.crimecheck_url)
          } else {
            this.api.showToast(res.message, "2000", "bottom");
          }
        },
        (err) => {
          this.api.autoLogout(err,"");
        }
      );
  }

  openBrowswer() {}

  public facebookVerify() {
    this.fb
      .login(["email", "public_profile"])
      .then((response: FacebookLoginResponse) => {
        this.fb
          .api(
            "me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)",
            []
          )
          .then((profile) => {
            this.userData = {
              id: profile["id"],
              email: profile["email"],
              first_name: profile["first_name"],
              picture: profile["picture_large"]["data"]["url"],
              username: profile["name"],
            };
        
            let fbParams: any = { access_token: this.userData.id };
            this.api.showLoader();
            this.api
              .facebookVerify(fbParams)
              .pipe(
                finalize(() => {
                  this.api.hideLoader();
                })
              )
              .subscribe(
                (res: any) => {
                  if (res.success) {
                    this.checkVerification();
                    this.api.showToast("Profile Verified", 2000, "bottom");

                    if (
                      this.backgroundCheck &&
                      this.isPhoneVerified &&
                      this.isEmailVerified
                    ) {
                      this.navCtrl.navigateRoot("home/tabs/profile-menu");
                    }
                  } else {
                    this.api.showToast(
                      "That Facebook account is already linked to a PetCloud account.",
                      2000,
                      "bottom"
                    );
                  }
                },
                (err: any) => {
                  this.api.autoLogout(err,"");
                }
              );
          });
      });
  }

  async showActionSheet(docType,pageSide) {
    this.documentType = docType;
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Document Photo From",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.photoOption(this.camera.PictureSourceType.CAMERA,pageSide);
          },
        },
        {
          text: "Gallery",
          handler: async () => {
            const status = await this.cameraAPI.checkPhotoLibraryPermission();
            if(status) {
              this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY,pageSide);
            }
          },
        },
        {
          text: "Cancel",
        }
      ],
    });
    await actionSheet.present();
  }

  photoOption(params,pageType) {
      this.cameraAPI.getPicture(params).then((base64String:any)=>{
        this.myImageUrl = "data:image/jpeg;base64," + base64String;
        this.ImageUpload(base64String,pageType);
      },err=>{
        
      })
  }

  ImageUpload(imageData,pageSide) {
    const fileParams = {
      image: this.myImageUrl,
      file_name: "image.jpg",
      docType: this.documentType,
      pageside:this.documentType == "licence" ? pageSide : ""
    };
    this.api.showLoader();
    this.api
      .uploadBackground(fileParams)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
    })
      )
      .subscribe(
        async (res: any) => {
          if (res.success) {
            this.api.showToast("File Uploaded.", 2000, "bottom");
           await this.checkVerification();
            this.api.hideLoader();
            
            if(this.documentType !="animalcare"){
              if (this.isPhoneVerified && this.isEmailVerified) {
                this.navCtrl.navigateRoot("home/tabs/profile-menu", {
                  skipLocationChange: true,
                });
              }
            }else if(this.documentType == "animalcare"){
              const alert = await this.alertController.create({
                message: 'Certificate uploaded. Waiting Verification by PetCloud Team". Follow up?',
                buttons: [
                  {
                    text: 'Not Now',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                      if (this.isPhoneVerified && this.isEmailVerified) {
                        this.navCtrl.navigateRoot("home/tabs/profile-menu", {
                          skipLocationChange: true,
                        });
                      }
                    }
                  }, {
                    text: 'Follow Up',
                    handler: async () => {

                      this.api.sendEmailtoAccounts("service@petcloud.com.au","","Follow up for verifications.","")
                  }
                  }
                ]
              });
          
              await alert.present();
            }
          
          } else {
            this.api.showToast("Error: Image upload failed.", 2000, "bottom");
          }
        },
        (err: any) => {
          this.api.autoLogout(err,"");
        }
      );
  }

  viewLicenseDoc(imageLink){
    this.api.openExteralLinks(imageLink);
  }

  openBrowser(link) {
    if (link == "yellowcard") {
      this.api.openExteralLinks( "https://workerscreening.dsdsatsip.qld.gov.au/workers/you-start")
    } else if("accreditedanimalcare"){
      this.api.openExteralLinks("https://www.petcloud.com.au/petsittercourse")
    }else {
      this.api.openExteralLinks( "https://www.ndiscommission.gov.au/workers/training-course")
    }
  }

   // active hardware back button
   backButtonEvent() {

    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
        if (this.router.url == "/profile-email-verify" ) {
            this.navCtrl.navigateRoot("/home/tabs/sitter-listing")
        }
    });
}
}
