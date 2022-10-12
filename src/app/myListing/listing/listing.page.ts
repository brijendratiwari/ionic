import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from "../../api/petcloud-api.service";
import { User } from "../../../../src/app/model/user";
import { finalize } from "rxjs/operators";
import { NavController, AlertController } from "@ionic/angular";


@Component({
  selector: "app-listing",
  templateUrl: "./listing.page.html",
  styleUrls: ["./listing.page.scss"],
})
export class ListingPage implements OnInit {
  userId: any;
  listingStatus: any = null;
  webURLLink: any;
  isListing: boolean = false;
  isProfileVerified: boolean = false;
  completedProfileStep: any;
  VERIFIED = "Verified"
  progressStepper:any;
  userData: any;
  progressShow: any;
  steps: any
  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public api: PetcloudApiService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getInfo();  
  }

  async getInfo() {
    const user = await this.storage.get(PetcloudApiService.USERBASICINFO);
    this.userData = user;
    this.listingStatus = user.listingStatus;
    this.progressShow = user.progressShow;
    this.progressStepper = user.progress;

    if(user.user_type == 1) {
      const stepperMenu = {
        profile: this.progressStepper.profile, 
        email: this.progressStepper.email,      
        pet: this.progressStepper.pet,  
        postedJobs: this.progressStepper.postedJobs,        
        wallet: this.progressStepper.wallet,      
      }

      const propertyValues = Object.values(stepperMenu);
      this.completedProfileStep = propertyValues.filter(x => x === 1).length;
      this.steps = Object.keys(stepperMenu);

    } else {
      const stepperMenu = {
        profile: this.progressStepper.profile,
        email: this.progressStepper.email,
        training: this.progressStepper.training,
        payOut: this.progressStepper.payOut,
        listing: this.progressStepper.listing,
        // viewJobs: this.progressStepper.viewJobs,
      }

      const propertyValues = await Object.values(stepperMenu);
      this.completedProfileStep = propertyValues.filter(x => x === 1).length;
      this.steps = Object.keys(stepperMenu);
    }
    
    user.listingStatus == null ? (this.isListing = false) : (this.isListing = true);
    this.storage.get(PetcloudApiService.USER).then(
      async (res: User) => {
        this.userId = res.id;
       
        this.webURLLink = res.share_url;

        if (res.user_type == 2 || res.user_type == 3) {
          if (res.verified == 0 ||
            res.verify_phoneflag == "N" ||
            res.BackgroundCheck['is_verified'] != this.VERIFIED){
              this.isProfileVerified = false;
              this.api.verificationModel()
            }else{
              this.isProfileVerified = true;
            }
        }else{
          if (res.verified == 0 || res.verify_phoneflag == "N"){
            this.isProfileVerified = false;
            this.api.verificationModel()
          }else{
            this.isProfileVerified = true;
          }
        }

      },
      (err) => {
        
      }
    );
  }

  navigateTo(param) {
    let goToURL = [
      "listing-basic-information",
      "listing-photos",
      "listing-services",
      "home-description",
      "skills",
    ];

      if (param == 1) {
        { 
          this.navCtrl.navigateForward("/" + goToURL[0]);
        }
      } else if (param == 2) {
        {
          this.navCtrl.navigateForward("/" + goToURL[1]);
        }
      } else if (param == 3) {
        {
          this.navCtrl.navigateForward("/" + goToURL[2]);
        }
      } else if (param == 4) {
        {
          this.navCtrl.navigateForward("/" + goToURL[3]);
        }
      } else if (param == 5) {
        { 
          this.navCtrl.navigateForward("/" + goToURL[4]);
        }
      }
    }

  //Activate Deactivate Listing Status
  async changeListingStatus(status) {
    const alert = await this.alertController.create({
      header: "Alert!",
      message: "Do you want to " + status + " listing?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
         
        },
        {
          text: "Okay",
          handler: () => {

            let activeStatus ={
              status : this.listingStatus == null || this.listingStatus == 0 ? 0 : 1
            }

        
            this.api.showLoader();
            this.api
              .listingStatus(activeStatus)
              .pipe(
                finalize(() => {
                  this.api.hideLoader();
                })
              )
              .subscribe(
                (res: any) => {
                  if (res.status) {
                    this.api.showToast("Listing Updated", 2000, "bottom");
                    
                    this.storage.set(PetcloudApiService.USER,res.user).then((userData : User)=>{
                      this.navCtrl.navigateRoot("home/tabs/profile-menu");
                    })
                  }
                },
                (err: any) => {
                  this.api.autoLogout(err,activeStatus);
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }

  async shareFacebook() {

    this.api.shareViaFb(null,null,this.webURLLink);
  }

  public openWebpage(url: string) {
    this.api.openExteralLinks(url)
  }
}
