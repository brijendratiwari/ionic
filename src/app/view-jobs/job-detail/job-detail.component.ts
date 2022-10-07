import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  NavParams,
  NavController,
  Platform,
} from "@ionic/angular";
import { PetcloudApiService } from "../../api/petcloud-api.service";
import { finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { User } from "../../model/user";
import { PetDetailsComponent } from "../../pet-details/pet-details.component";
import { Router } from "@angular/router";
import * as moment from 'moment';
import { AppsFlyerService } from "../../../../src/app/apps-flyer.service";

@Component({
  selector: "app-job-detail",
  templateUrl: "./job-detail.component.html",
  styleUrls: ["./job-detail.component.scss"],
})
export class JobDetailComponent implements OnInit {
  public jobDetail: any;
  public userId: any;
  public loggedInUser: any;
  public isOwner: boolean = false;
  public earnUpto: any;
  public override: string = "";
  public showContent: Boolean = false;
  public isActiveListing;
  public isStripConnect;
  public isPaypal;
  public serviceType: any;
  public noSupportPet: any;
  public jobServiceId: any; // Job Service Id
  public bookingType: any; // Recurring or non recurring
  public minCompetitivePrice: any;
  public maxCompetitivePrice: any;
  public isInputVal: boolean = false;
  public isModalClick;

  public isPhVerifed: boolean = false;
  public isEmailVerified: boolean = false;
  public backgroundVerify: boolean = false;
  public userData: any;
  VERIFIED = "Verified"

  constructor(
    public modal: ModalController,
    protected petModal: ModalController,
    protected navParam: NavParams,
    public storage: Storage,
    public router: Router,
    public navCtrl: NavController,
    public platform: Platform,
    public api: PetcloudApiService,
    public appsFlyerService: AppsFlyerService
  ) {
    this.getUser();

    this.isModalClick = this.navParam.get("isModalClick");
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ionViewDidEnter() {
    this.getJobDetail();
  }

  getJobDetail() {
    this.api.showLoader();
    const jobId = this.navParam.get("jobId");
    this.api
      .showJobDetails(jobId)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          if (res.success) {
            this.jobDetail = await res;
          
            console.log("applied user", this.jobDetail.job.appliedUser.id);

            this.jobDetail.job.start_date =  await moment(this.jobDetail.job.start_date).format("MMM DD YYYY, h:mm A"); 
            this.jobDetail.job.end_date = await moment(this.jobDetail.job.end_date).format("MMM DD YYYY, h:mm A"); 
            this.earnUpto = "You could earn up to $" + res.job.estimatecost;

            if (res.noSupport) {
              let petList = res.noSupport;

              this.noSupportPet = Array.prototype.map
                .call(petList, function (item) {
                  return item;
                })
                .join(",");
            }
           // 1 is for recurring 0 for non recurring.
            //if job is recurring then weekly price else total price.
            this.bookingType = res.job.bookingtype;

            if (this.bookingType == 0 || this.bookingType == null) {
              if (res.servicemessage) {
                this.minCompetitivePrice = res.servicemessage.weeklyCost / 2;
                this.maxCompetitivePrice =
                  (res.servicemessage.weeklyCost * 20) / 100 +
                  res.servicemessage.totalCost;
              }
            } else if (this.bookingType == 1) {
              this.minCompetitivePrice = res.servicemessage.totalCost / 2;
              this.maxCompetitivePrice =
                (res.servicemessage.totalCost * 20) / 100 +
                res.servicemessage.totalCost;
            }
            this.userId = this.jobDetail.job.appliedUser.id;
            if (this.userId == this.loggedInUser) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
            }

            this.showContent = true;
          } else {
            this.api.showToast(
              "job detail not found please try again!",
              2000,
              "bottom"
            );
          }
        },
        (err: any) => {
          this.api.autoLogout(err,jobId);
        }
      );
  }

  async petDetail(petDetails) {
    this.modal.dismiss();
    let petDetail = [];
    petDetail.push(petDetails);
    this.isModalClick = true;
    const modal = await this.petModal.create({
      component: PetDetailsComponent,
      animated: true,
      componentProps: {
        petDetails: petDetail,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.isModalClick = false;
    });
    return await modal.present();
  }

  /**
   * close self modal
   */
  public closeModal() {
    this.api.hideLoader();
    this.modal.dismiss();
  }

  inputValue(event) {
    if (event.detail.value == "") {
      this.isInputVal = false;
    } else if (event.detail.value != "") {
      this.isInputVal = true;
    }
  }

  public async applyJob(jobid: any, overridePrice: any) {
 
    if (this.userData.user_type == 2 || this.userData.user_type == 3) {

    
      if (this.userData.verified == 0 ||
        this.userData.verify_phoneflag == "N" ||
        this.userData.righttowork['is_verified'] != this.VERIFIED ||
       this.userData.animalcare['is_verified'] != this.VERIFIED ||
        this.userData.BackgroundCheck['is_verified'] != this.VERIFIED){
          await  this.api.isVerificationPendingModel();
        }else{
          this.validateAPI(jobid, overridePrice);
        }
        

     
    } else if (this.userData.user_type == 1) {
      if (
        this.userData.verified == 0 ||
        this.userData.verify_phoneflag == "N" 
      ) {
        await this.api.isVerificationPendingModel();
      } else {
        this.validateAPI(jobid, overridePrice);
      }
    } else {
      this.validateAPI(jobid, overridePrice);
    }
  }

  validateAPI(jobid, overridePrice) {
   
    if (this.isInputVal) {
      if (
        this.minCompetitivePrice >= this.override ||
        this.maxCompetitivePrice <= this.override) {
        this.api.showToast(
          "New offered price can’t be less than half of your listed price calculated per week",
          3000,
          "bottom"
        );
      } else if (this.maxCompetitivePrice <= this.override) {
        this.api.showToast(
          "Amount is more than your listed price, please change your listing and then apply",
          3000,
          "bottom"
        );
      } else {
        this.getJob(jobid, overridePrice);
      }
    } else if (!this.isInputVal) {
      this.getJob(jobid, overridePrice);
    }
  }

  getJob(jobid, overridePrice) {
    this.api.showLoader();
    this.api
      .applyJob(jobid, overridePrice)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            const booking = {
              af_booking_status:"J",
              af_booking_id:res.bookingId,
              af_potentional_revenue:"",
              af_actual_revenue:"",
              af_minder_id: this.userId,
              af_owner_id: this.jobDetail.job.appliedUser.id
            }
            this.appsFlyerService.bookingEvent(booking);

            this.api.showToast("job application successful. You will be notified if the owner accepts your application.", 2000, "bottom");
            this.modal.dismiss();
          } else {
            this.api.showToast(res.error, 2000, "bottom");
            this.modal.dismiss();
          }
        },
        (err: any) => {
          this.api.autoLogout(err,{jobid, overridePrice});
        }
      );
  }

  doVerification() {
    this.modal.dismiss();
    this.navCtrl.navigateForward("/profile-email-verify", {});
  }

  getUser() {
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        this.userData = userData;
        this.serviceType = userData.primaryServices;
        this.loggedInUser = userData.id;
        this.isActiveListing = userData.listingStatus;
        this.isPaypal = userData.paypal_email;
        this.isStripConnect = userData.stripeConnectEnabled;

        userData.verify_phoneflag == "N"
          ? (this.isPhVerifed = false)
          : (this.isPhVerifed = true);
        userData.verified == 0
          ? (this.isEmailVerified = false)
          : (this.isEmailVerified = true);
        userData.isBackgroundChecked == false
          ? (this.backgroundVerify = false)
          : (this.backgroundVerify = true);
      },
      (err) => {}
    );
  }

  goToListing() {
    this.api.hideLoader();
    this.modal.dismiss();
    this.router.navigateByUrl("/listing");
  }

  goToListingService() {
    this.api.hideLoader();
    this.modal.dismiss();
    this.router.navigateByUrl("/listing-services");
  }

  payoutReference() {
    this.api.hideLoader();
    this.modal.dismiss();
    this.router.navigateByUrl("/payout-prefrence");
  }
}
