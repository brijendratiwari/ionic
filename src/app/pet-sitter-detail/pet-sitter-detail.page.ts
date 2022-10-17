import { Component, OnInit } from "@angular/core";
import { PetcloudApiService } from "../../app/api/petcloud-api.service";
import { Storage } from "@ionic/storage";
// import model files
import { User } from "../../app/model/user";
import { ActivatedRoute, Router } from "@angular/router";
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { finalize } from "rxjs/operators";
import {
  ActionSheetController,
  NavController,
  ModalController,
  IonSlides,
} from "@ionic/angular";
import { ViewChild } from "@angular/core";
// import { Slides } from "ionic-angular";
import * as moment from "moment";
import { PolicyComponent } from "../policy/policy.component";
import { BadgeModelComponent } from "../badge-model/badge-model.component";
import { AnalyticsService } from '../analytics.service';
import { ReportListingComponent } from "../myListing/report-listing/report-listing.component";
import { Events } from "../events";

@Component({
  selector: "app-pet-sitter-detail",
  templateUrl: "./pet-sitter-detail.page.html",
  styleUrls: ["./pet-sitter-detail.page.scss"],
})
export class PetSitterDetailPage implements OnInit {
  public isAPILoaded: boolean = false;
  daysConfig: DayConfig[] = [];
  // diclare sitterData
  public sitterData: User;
  public reviews: any;
  public infoIcons: any;
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    // navigation: {
    //   nextEl: ".backBtn",
    //   prevEl: ".nextBtn",
    // },
    zoom: {
      toggle: false,
    },
    preloadImages: false,
    lazy: true,
    height: "300",
  };
  public policyMessage: "";
  protected routeParams: any;
  public selectedSegment = "";
  public petType = [];
  public petList = [];
  public previousClients = [];
  public listing: any = null;
  public type: 'string' = "string"; // calendar date type
  public sitterProfile: any;
  public calendarOption: CalendarComponentOptions;
  public selectedBlockDay = {
    selectedMonth: "",
    day: [],
  };
  public selectedDays: any;
  public isCurrentUser: boolean = false;

  public favSitter = { minderid: "", type: "" };
  userData: any;
  web_url: any;
  // check is Faviourate
  isFavourite: any;
  public response_time: string = "";
  public repeat_client: number = 0;
  public repeat_rate: number = 0;
  public id: any;
  public isInstantMessageButton: any;
  public getPreviousURL: any;
  public cancelledBookings: any = 0;
  // when sitter is marked as fav or unfav previous page data need to be refreshed;
  public isRefreshNavigation: boolean = false;
  public availability: any;
  @ViewChild("slides") slides: IonSlides;
  public totalBookings: any = 0;
  public steps: any;
  public petCount: any;
  public petBreed: any;
  public currentIndex: any = 0;

  constructor(
    public api: PetcloudApiService,
    private storage: Storage,
    public model:ModalController,
    private activeRoute: ActivatedRoute,
    protected router: Router,
    public navcntl: NavController,
    public events: Events,
    public modelCntl: ModalController,
    public navCtrl: NavController,
    public firebaseAnalytics: AnalyticsService,
    public actionSheetController: ActionSheetController
  ) {
    this.id = activeRoute.snapshot.paramMap.get("userId");

    // Showing and Hiding isInstant Message button in Footer
    this.getInfo();

    this.routeParams = this.activeRoute.snapshot.params;
    this.favSitter.minderid = this.routeParams.userId;
    this.favSitter.type = "favourite";
  }

  ionViewWillEnter() {
    this.isAPILoaded = false;
    this.isRefreshNavigation = false;
    this.getSittersProfileDetails();
  }

  ngOnInit() {
      this.firebaseAnalytics.setUser();
      this.firebaseAnalytics.logEvent(PetcloudApiService.pet_sitter_detail_analytics,{"sitterId": this.id})
  }

  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }
  async slideChanged() {
    this.currentIndex = await this.slides.getActiveIndex();
  }
  public getSittersProfileDetails() {
    this.api.showLoader();
    this.api
      .getSittersProfileDetails(this.id)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.isAPILoaded = true;
            this.web_url = res.web_url;
            this.sitterProfile = res;
            this.sitterData = res.user;
            this.isFavourite = res.isFavourite;

            if(this.userData != null){
              this.id == this.userData.id ? this.isCurrentUser = true : this.isCurrentUser = false;
            }else{
              this.isCurrentUser = false
            }
            
            if(res.reviews.length){              
              res.reviews.forEach(async element => {
                element.createdate = await moment(element.createdate).format("MMM YYYY");
              });
            }


            this.reviews = res.reviews;
            this.infoIcons = res.infoIcons;
            this.response_time = res.response_time;
            this.repeat_client = res.repeat_client;
            this.repeat_rate = res.repeat_rate;
            this.availability = res.availability;
            this.petList = res.user.petList;
            this.previousClients = res.past_clients;
            this.cancelledBookings = res.cancelledBookings;
            this.totalBookings = res.totalBookings;
            this.petCount = res.petsCount;
            this.listing = res.user.listing
        
        
            let title;
            if (res.user.listing.cancellation_policy == 0) {
              title = "Strict";
            } else if (res.user.listing.cancellation_policy == 1) {
              title = "Flexible";
            } else {
              title = "Moderate";
            }

            this.api.policyDetails().subscribe((res: any)=>{
              res.forEach(element => {
                  if(element.PolicyName == title){
                    this.policyMessage = element.content
                  }
                });
            })

            this.petBreed = res.petsBreed;
            this.getAvailibility(res.availability);

     
            for (let prcRule of this.sitterData.primaryServices) {
              // parse json of pricing rules.
              prcRule.pricingRules = JSON.parse(prcRule.pricingRules);
              let prcArr = [];
              for (let i in prcRule.pricingRules) {
                prcArr.push({
                  petName: PetcloudApiService.PETTYPE[i],
                  price: prcRule.pricingRules[i],
                });
                if (parseFloat(prcRule.pricingRules[i]) > 0) {
                  this.petType.push(PetcloudApiService.PETTYPE[i]);
                }
              }
              prcRule["petPrice"] = prcArr;
            }
            if(this.sitterProfile.new_services.group_services && this.sitterProfile.new_services.group_services.length){
              for (let servd of this.sitterProfile.new_services.group_services) {
                
                for (let prcRule of servd.data) {
                
                  prcRule.pricingRules = JSON.parse(prcRule.pricingRules);
                  let prcArr = [];
                  for (const i in prcRule.pricingRules) {
                    prcArr.push({
                      petName: PetcloudApiService.PETTYPE[i],
                      price: prcRule.pricingRules[i],
                    });
                  }
                  //console.log(prcArr);
                  prcRule["petPrice"] = prcArr;
                }
              }
            }
            if(this.sitterProfile.new_services.secondary_services){
              for (let prcRule of this.sitterProfile.new_services.secondary_services) {
                
                prcRule.pricingRules = JSON.parse(prcRule.pricingRules);
                let prcArr = [];
                for (const i in prcRule.pricingRules) {
                  prcArr.push({
                    petName: PetcloudApiService.PETTYPE[i],
                    price: prcRule.pricingRules[i],
                  });
                }
                //console.log(prcArr);
                prcRule["petPrice"] = prcArr;
              }
            }

            if(this.sitterProfile.new_services.normal_services){
              for (let prcRule of this.sitterProfile.new_services.normal_services) {
                //console.log(prcRule.serviceType.serviceName);
                prcRule.pricingRules = JSON.parse(prcRule.pricingRules);
                let prcArr = [];
                for (const i in prcRule.pricingRules) {
                  prcArr.push({
                    petName: PetcloudApiService.PETTYPE[i],
                    price: prcRule.pricingRules[i],
                  });
                }
                prcRule["petPrice"] = prcArr;
              }
            }

            for (let prcRule of this.sitterData.secondaryServices) {
              prcRule.pricingRules = JSON.parse(prcRule.pricingRules);
              let prcArr = [];
              for (const i in prcRule.pricingRules) {
                prcArr.push({
                  petName: PetcloudApiService.PETTYPE[i],
                  price: prcRule.pricingRules[i],
                });
              }
              prcRule["petPrice"] = prcArr;
            }

            this.api.hideLoader();
            this.selectedSegment = "info";
            const availabilityData = {
              sitterId: this.sitterData.id,
              sitterName: this.sitterData.first_name,
              primaryService: this.sitterData.primaryServices,
              secondaryService: this.sitterData.secondaryServices,
              operating_days: this.sitterProfile.operating_days,
              isRebook: false,
            };
            this.storage.set("availabilitySitter", availabilityData);
            setTimeout(() => {
              if(this.slides) {
                if(this.sitterData?.spaceImages?.length > 1) {
                  this.slides.lockSwipes(false);
                } else {
                  this.slides.lockSwipes(true);
                }
              }
            }, 500);
            
          } else {
            this.isAPILoaded = false;
            this.api.showToast(
              "sitters details not found! Try again.",
              2000,
              "bottom"
            );
          }
        },
        (err: any) => {
          this.isAPILoaded = false;
        }
      );
  }

  public async reportListing(sitterData){
    const modal = await this.modelCntl.create({
      component: ReportListingComponent,
      animated: true,
      // cssClass: "modalCss",
      componentProps: {
          userId:this.id
      },     
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  public convertNumberToArray(number: any) {
    return new Array(number);
  }

  public parsePriceRule(priceRule: any) {
    return JSON.parse(priceRule);
  }

  public parsePetName(priceKey: any) {
    return PetcloudApiService.PETTYPE[priceKey];
  }

  public getPropertyType(id: any): string {
    switch (id) {
      case "2":
        return "House";
        break;
      case "3":
        return "Apartment & Unit";
        break;
      case "4":
        return "Apartment";
        break;
      case "5":
        return "Unit";
        break;
      case "6":
        return "Townhouse";
        break;
      case "7":
        return "Villa";
        break;
      case "8":
        return "Land";
        break;
      case "9":
        return "Acreage";
        break;
      case "10":
        return "Rural";
        break;
      case "11":
        return "Block of Units";
        break;
      case "12":
        return "Retirement Living";
        break;
      default:
        return "Not Specified";
    }
  }

  public getVetDistance(id: any): string {
    switch (id) {
      case "1":
        return "1-2 kms";
        break;
      case "2":
        return "3-5 kms";
        break;
      case "3":
        return "6-15 kms";
        break;
      case "4":
        return "16+ kms";
        break;
      default:
        return "Not Specified";
    }
  }

  public getBackyardSize(id: any): string {
    switch (id) {
      case "1":
        return "Inside available only";
        break;
      case "2":
        return "Balcony or deck";
        break;
      case "3":
        return "Small fenced yard";
        break;
      case "4":
        return "Medium fenced yard";
        break;
      case "5":
        return "Large fenced yard";
        break;
      case "6":
        return "Fenced Acreage";
        break;
      default:
        return "Not Specified";
    }
  }

  public checkAvailability() {

    if(this.userData != null){
      this.router.navigateByUrl("check-availability",{
      });
    }else{
      this.api.SignInWindow();
    }
  }

  public getAvailibility(availablity) {
    if (availablity) {
      let length = availablity.length;
      if (length == 1) {
        let startDate = availablity[0].start;
        let endDate = availablity[0].end;
        let type = availablity[0].title;

        this.selectedBlockDay.day.push(this.getDates(startDate, endDate));
        this.selectedDays = this.getDates(startDate, endDate);
        
        if (type == "limited") {
          this.selectedDays.forEach((element) => {
            this.daysConfig.push({
              date: new Date(element),
              cssClass: "limitedDays",
            });
          });
        } else if (type == "Blocked") {
          this.selectedDays.forEach((element) => {
            this.daysConfig.push({
              date: new Date(element),
              cssClass: "unavailableDays",
            });
          });
        }

        this.calenderOption();
      }

      if (length > 1) {
        let blocked = [];
        let unavailable = [];

        availablity.forEach((element) => {
          if (element.title == "limited") {
            if (element.start == element.end) {
              blocked.push(element);
              this.daysConfig.push({
                date: new Date(element.start),
                cssClass: "limitedDays",
              });
            } else if (element.start != element.end) {
              let dates = [];
              dates = this.getDates(element.start, element.end);
              dates.forEach((date) => {
                blocked.push(date);
                this.daysConfig.push({
                  date: new Date(date),
                  cssClass: "limitedDays",
                });
              });
            }
          } else if (element.title == "Blocked") {
            if (element.start == element.end) {
              unavailable.push(element);
              this.daysConfig.push({
                date: new Date(element.start),
                cssClass: "unavailableDays",
              });
            } else if (element.start != element.end) {
              let dates = [];
              dates = this.getDates(element.start, element.end);
              dates.forEach((date) => {
                unavailable.push(date);
                this.daysConfig.push({
                  date: new Date(date),
                  cssClass: "unavailableDays",
                });
              });
            }
          }
        });

        this.calenderOption();
      }
    }
  }

  calenderOption() {
    this.calendarOption = {
      daysConfig: this.daysConfig,
      color: "dark",
      pickMode: "multi",
    };
  }

  async badgeInfo(imageName, badgeName) {
    const modal = await this.modelCntl.create({
      component: BadgeModelComponent,
      animated: true,
      cssClass: "modalCss",
      componentProps: {
        imageName,
        badgeName,
      },
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  getDates(startDate, endDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var endDt = moment(endDate);
    while (currentDate <= endDt) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
    // return dateArray;
  }

  cancelMessage(e,message){
    if(e != "cancelled"){
      this.api.singleAlert(
        "Error",
        message
      );
    }
  }

  async share() {
    const actionSheet = await this.actionSheetController.create({
      header: "Share",
      buttons: [
        {
          text: "Facebook",
          icon: "logo-facebook",
          handler: () => {  
            this.api.shareViaFb(null,null,this.web_url)
          },
        },
        {
          text: "Whatsapp",
          icon: "logo-whatsapp",
          handler: () => {
            this.api.shareViaWhatsapp("","",this.web_url);
          },
        },
        {
          text: "Twitter",
          icon: "logo-twitter",
          handler: () => {
            this.api.shareViaTwitter(null,null,this.web_url)
          },
        },
        {
          text: "Email",
          icon: "mail",
          handler: async () => {

            this.api.sendEmailtoAccounts("","","Pet Sitter",this.web_url);
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
       
        },
      ],
    });
    await actionSheet.present();
  }

  async displayPolicyDetail(title) {
    const modal = await this.modelCntl.create({
      component: PolicyComponent,
      animated: true,
      cssClass: "modalCss",
      componentProps: {
        title,
        message: this.policyMessage
      },
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  updateFaviourateUnfaviourate(status) {
    if(this.userData != null){
      this.events.publish("isFaviourate", {status: true, time: Date.now()});
      this.favSitter.type = status == "1" ? "unfavourite" : "favourite";
      this.api.showLoader();
      this.api
        .sitterfavourite(this.favSitter)
        .pipe(
          finalize(() => {
            this.api.hideLoader();
          })
        )
        .subscribe(
          (res: any) => {
            this.api.hideLoader();
            this.isRefreshNavigation = true;
            this.ionViewWillEnter();
            if (res.message == "Favourite") {
              this.api.showToast(
                "Successfully Marked as Favourite.",
                2000,
                "bottom"
              );
            } else if (res.message == "Unfavourite") {
              this.api.showToast(
                "Successfully Marked as Unfavourite.",
                2000,
                "bottom"
              );
            }
          },
          (err: any) => {
            this.api.hideLoader();
            this.isRefreshNavigation = false;
            this.api.showToast("Error In Updating.", 2000, "bottom");
            this.api.autoLogout(err,this.favSitter);
          }
        );
    }else{
      this.api.SignInWindow();
    }
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      (res: User) => {
        this.userData = res;
      },
      (err) => {
        
      }
    );

  }

  navigateBack() {
    if (this.isRefreshNavigation) {
      this.navcntl.navigateRoot("/home/tabs/messages", {
      });
    } else {
      
      this.navcntl.navigateRoot("/home/tabs/sitter-listing", {
      });
    }
  }
}
