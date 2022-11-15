import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { PetcloudApiService } from "../api/petcloud-api.service";
import {  finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { User } from "../model/user";
import { JobDetailComponent } from "./job-detail/job-detail.component";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { SearchJobFilterComponent } from "../search-job-filter/search-job-filter.component";
import { DatePipe } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { PetDetailsComponent } from "../pet-details/pet-details.component";
import { SocailshareComponent } from "../socailshare/socailshare.component";
import { AlertController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, GeolocationOptions } from "@ionic-native/geolocation/ngx";
import { Subscription } from "rxjs";

@Component({
  selector: "app-view-jobs",
  templateUrl: "./view-jobs.page.html",
  styleUrls: ["./view-jobs.page.scss"],
})
export class ViewJobsPage implements OnInit {
  public jobSearch: any;
  public jobDetail: any = {};
  public stateList: [];
  // Start and end date of Filter
  public start_date: any;
  public end_date: any;
  public userStateId: any;

  infiniteScroll: any = null;
  public isHidePagination: boolean = false;

  // Set Limit in filter
  public pageno: any;
  public offsetLimit = 0;
  public userId: any;
  public isModelClick: boolean = false;
  public isAPILoaded: boolean = false;

  public isJobSearch = false; // is Job Search
  public isfilterJob = false; // is Filter Searching

  @ViewChild("places") places: GooglePlaceDirective;
  @ViewChild("search") public searchElement: ElementRef;

  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
  };

  public jobpostingSearchData = {
    suburb: "",
    lat: "",
    lng: "",
    offset: 0,
    limit: 5,
  };

  public filterSearchAjaxData = {
    location: "",
    service_type_id: "",
    distance: "",
    start_date: "",
    end_date: "",
    petTypes: "",
    breed: "",
    petWeight: "",
    state: "",
    suburb: "",
    lat: "",
    lng: "",
    offset: 0,
    limit: 5,
    firstTimeLoading: false,
    ratepernight: 0,
    bookingtype: ''
  };
  public state: any;
  geolocationOptions: GeolocationOptions;
  userDetails: any = null;
  public jobpostingSearch: any = [];
  public jobsList: any = [];
  public googleSearch: any = "";
  public post: any = { color: "primary" };
  private jobAPISubscription = new Subscription();
  private viewJobRoutingEvent = new Subscription();

  selectedFilter: any = {
    breed: '',
    distance: 0,
    start_date: '',
    end_date:'',
    petWeight:"",
    serviceTypeId: '',
    petTypes: '',
    ratepernight: 0,
    bookingtype: ''
  };

  constructor(
    protected api: PetcloudApiService,
    protected storage: Storage,
    public modalCtrl: ModalController,
    public platform: Platform,
    public router: Router,
    public modelCtrl: ModalController,
    public alertCtrl: AlertController,
    public datePipe: DatePipe,
    public navCntl: NavController,
    public geolocation: Geolocation,
    private diagnostic: Diagnostic,
    public locationAccuracy: LocationAccuracy
  ) {
    this.backButtonEvent();

    this.viewJobRoutingEvent = router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe((e: any) => {

        if (e.url == "/home/tabs/jobs-tab/view-jobs") {
       
          this.storage.get(PetcloudApiService.USER).then((userData: User) => {
            if (userData == null) {
              this.api.SignInWindow();
            }else{
              if(this.platform.is("android")){
                this.getLocationAccuracy();
              }  else{
                this.isLocationAuthorized();
              }


              this.registerNetworkChange();
              
            }
          });  
        }
    });

  }

  ngOnInit() {
    this.getInfo()
  }

  ionViewWillLeave() {
    this.jobAPISubscription.unsubscribe();
    this.viewJobRoutingEvent.unsubscribe();
   }
  

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
        this.userDetails = res;
      }
    })
  }

  async registerNetworkChange() {
    let that = this;
    await this.platform.ready();
    this.diagnostic.registerLocationStateChangeHandler(function (state) {
            if (state == "location_off") {
                that.isLocationAuthorized();
              } else {
                that.getLocationAccuracy();
              }
     
    });
  }

  public readNotification() {
    this.post.color = "light";
  }

    //Check if application having Location Authorization
    async isLocationAuthorized() {
      await this.platform.ready();
      this.diagnostic.requestLocationAuthorization();
      this.diagnostic.isLocationEnabled().then((isEnabled: any) => {
        if (isEnabled) {
            this.diagnostic.isLocationAuthorized().then((success: any) => {
              success ? this.getLocationAccuracy() : this.defaultUserLocation()
            }, err => {
              this.defaultUserLocation();
            })
        } else {
       
            this.defaultUserLocation();
          }
        }, err => {
          this.defaultUserLocation();
        })
    }

    defaultUserLocation() {
     
      this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
        if (res != null) {
          this.jobpostingSearch.lat = res.latitude;
          this.jobpostingSearch.lng = res.longitude;
          this.jobpostingSearchData.lat = res.latitude;
          this.jobpostingSearchData.lng = res.longitude;
          this.viewJobAPI();  
        }else{
        
        }
      })
    }

  async getLocationAccuracy() {
    await this.platform.ready();
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      (response_gps) => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.viewJobLocationPermission();
      },
      error => {
       this.defaultUserLocation();
      }
    );
  }




  viewJobLocationPermission() {
    this.isAPILoaded = false;
    // search first time with default location of loggedin user
    this.storage.get(PetcloudApiService.USER).then(async (userData: User) => {
      if (userData != null) {
        this.offsetLimit = 0;
        // this.jobsList = [];
        await this.platform.ready();
        this.diagnostic.getLocationAuthorizationStatus().then(async authStatus => {
          if (authStatus == "authorized" || authStatus == "authorized_when_in_use"
            || authStatus == "GRANTED" || authStatus == "GRANTED_WHEN_IN_USE") {

            await this.geolocation.getCurrentPosition().then(async (resp) => {
              if(resp){
                this.jobpostingSearch.lat = await resp.coords.latitude.toString();
                this.jobpostingSearch.lng = await resp.coords.longitude.toString();
                this.jobpostingSearchData.lat = await resp.coords.latitude.toString();
                this.jobpostingSearchData.lng = await resp.coords.longitude.toString();
                this.viewJobAPI();
              }
            });
          }else{
            this.defaultUserLocation();
          }
        })
      } else {
        this.router.navigateByUrl("/get-started");
      }
    });
  }

  async viewJobAPI(){
    this.jobpostingSearch["offset"] = this.offsetLimit;
    this.jobpostingSearch["limit"] = 5;
    this.jobpostingSearchData.offset = this.offsetLimit;
    this.jobpostingSearchData.limit = 5;

    // Changing Flags
    this.isJobSearch = true;
    this.isfilterJob = false;

  
    this.jobAPISubscription.add( await this.api
      .getSuburb(this.jobpostingSearch.lat, this.jobpostingSearch.lng)
      .subscribe(
        async (response: any) => {
          this.googleSearch = await response.locality;
          this.jobpostingSearch.suburb = await response.locality;
          this.jobpostingSearchData.suburb = await response.locality;

          await this.searchJobs(this.jobpostingSearch,"");
        },
        async (err) => {
          await this.searchJobs(this.jobpostingSearch,"");
          
        }
      )); 
    
  }

  public handleAddressChange(address: any) {
    this.isAPILoaded = false;
    this.jobpostingSearch["lat"] = address.geometry.location.lat();
    this.jobpostingSearch["lng"] = address.geometry.location.lng();
    this.jobpostingSearch["suburb"] = address.address_components[0].long_name;
    this.jobpostingSearch["offset"] = this.offsetLimit;
    this.jobpostingSearch["limit"] = 5;

    this.state = address.address_components[2].short_name;
 
    this.jobpostingSearchData.lat = address.geometry.location.lat();
    this.jobpostingSearchData.lng = address.geometry.location.lng();
  this.jobpostingSearchData.suburb = address.address_components[0].long_name;
    this.jobpostingSearchData.offset = 0;
    this.jobpostingSearchData.limit = 5;
    this.jobsList = [];

    this.searchJobs(this.jobpostingSearch,"");
  }

  public searchJobs(locations: any,infiniteScroll) {

    
    this.storage.get(PetcloudApiService.USER).then((userData: User) => {
      if (userData != null) {
        locations.userId = userData.id;

        if (this.offsetLimit == 0) {
          this.api.showLoader();
        }

        this.jobpostingSearchData.limit = 10;
        this.jobpostingSearchData.offset = this.offsetLimit;

        this.api
          .jobSearchMap(this.jobpostingSearchData)
          .pipe(
            finalize(() => {

              if(infiniteScroll != ""){
                infiniteScroll.target.complete();
              }


              if (this.offsetLimit == 0) {
                this.api.hideLoader();
              }
            })
          )
          .subscribe(
            (res: any) => {
              this.isAPILoaded = true;

              if (res.success) {
                const jobListData: any[] = res.entries;
                if (jobListData.length === 0) {
                  this.isHidePagination = true;
                } else if (jobListData.length > 0) {
                  this.isHidePagination = false;
                  for (const data of jobListData) {
                    const index = this.jobsList.findIndex((jobdata)=> jobdata.id == data.id);
                    if(index>-1) {
                        this.jobsList[index] = data;
                    } else {
                      this.jobsList.push(data);
                    }
                  }
                } else {
                  this.isHidePagination = true;
                  this.jobsList = [];
                  this.api.showToast(
                    "jobs not found! Try again.",
                    2000,
                    "bottom"
                  );
                }
              } else {
                this.isHidePagination = true;
                this.jobsList = [];
                this.api.showToast(
                  "jobs not found! Try again.",
                  2000,
                  "bottom"
                );
              }
            },
            (err: any) => {
              this.isAPILoaded = true;
              this.isHidePagination = true;
              this.api.autoLogout(err, this.jobpostingSearchData);
            }
          );
      } else {
        this.router.navigateByUrl("/get-started");
      }
    });
  }

  async showJobDetails(ev: any, jobId: any, earnUpto: any) {
    this.isModelClick = true;
    const modal = await this.modalCtrl.create({
      component: JobDetailComponent,
      animated: true,
      componentProps: {
        jobId: jobId,
        earnUpto: earnUpto,
        userId: this.userId,
        isModalClick: this.isModelClick,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.isModelClick = false;
      // Clear Job List
      this.offsetLimit = 0;


      // this.jobsList = [];
      this.searchJobs(this.jobpostingSearch,"");
    });
    return await modal.present();
  }

  public filterSearchAjax(filterSearchParams, infiniteScroll) {
  
    if (this.filterSearchAjaxData.firstTimeLoading == false) {
      this.api.showLoader();
      this.filterSearchAjaxData.firstTimeLoading = true;
    } else {
      this.filterSearchAjaxData.offset = this.filterSearchAjaxData.offset + 5
    }


    this.api
      .filterSearchajax(this.filterSearchAjaxData)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        (res: any) => {
          this.isAPILoaded = true;
          const filterJobListData: any[] = res.entries;

          if (infiniteScroll) {
            infiniteScroll.target.complete();
          }
          if (filterJobListData.length === 0) {
          } else if (filterJobListData.length > 0) {
            for (const data of filterJobListData) {
              const index = this.jobsList.findIndex((jobdata)=> jobdata.id == data.id);
              if(index>-1) {
                  this.jobsList[index] = data;
              } else {
                this.jobsList.push(data);
              }
            }
          } else {
            this.isAPILoaded = true;
            if (this.jobsList.length == 0) {
              this.jobsList = [];
            }
          }
        },
        (err) => {
          this.isAPILoaded = true;
          // 
          this.api.hideLoader();
          this.api.autoLogout(err, this.filterSearchAjaxData);
        }
      );
  }

  async petDetails(petDetails) {
    this.isModelClick = true;
    const modal = await this.modalCtrl.create({
      component: PetDetailsComponent,
      animated: true,
      componentProps: {
        petDetails: petDetails,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.isModelClick = false;
      // Clear Job List
      // this.jobsList = [];
      this.jobpostingSearchData.limit = 5;
      this.offsetLimit = 0;

      this.searchJobs(this.jobpostingSearch,"");
    });
    return await modal.present();
  }

  async jobSearchFilter() {
    this.isModelClick = true;
    const modal = await this.modalCtrl.create({
      component: SearchJobFilterComponent,
      animated: true,
      swipeToClose: true,
      mode: 'ios',
      backdropDismiss: true,
      componentProps: {selectedFilter: this.selectedFilter},
      cssClass: 'search-job-modal'
    });
    modal.onDidDismiss().then((data: any) => {
      this.isModelClick = false;
      this.isJobSearch = false;
      this.isfilterJob = true;
      // set offset limit
      this.offsetLimit = 0;
      console.log("data call1", data);
      // Check data.data is not undefined to check weather user dismissed without applying filter or not
      if (data.data !== undefined) {
        // Clear Job List
        this.jobsList = [];
        this.isAPILoaded = false;
        this.selectedFilter = data.data;
        // convert date format to Fri 28 Jun 2019
        this.start_date = new DatePipe("en-US").transform(
          data.data.start_date,
          "EEE dd MMM y"
        );
        this.end_date = new DatePipe("en-US").transform(
          data.data.end_date,
          "EEE dd MMM y"
        );

        let stateName = this.state == undefined ? "" : this.state;

        this.filterSearchAjaxData.lat = this.jobpostingSearchData.lat;
        this.filterSearchAjaxData.lng = this.jobpostingSearchData.lng;
        this.filterSearchAjaxData.suburb = this.jobpostingSearchData.suburb;
        this.filterSearchAjaxData.location =
          this.jobpostingSearchData.suburb + ", " + stateName;
        this.filterSearchAjaxData.state = stateName;
        this.filterSearchAjaxData.service_type_id = data.data.serviceTypeId;
        this.filterSearchAjaxData.distance = data.data.distance;
        this.filterSearchAjaxData.start_date = this.start_date;
        this.filterSearchAjaxData.end_date = this.end_date;
        this.filterSearchAjaxData.petTypes = data.data.petTypes;
        this.filterSearchAjaxData.breed = data.data.breed;
        this.filterSearchAjaxData.petWeight = data.data.petWeight;
        this.filterSearchAjaxData.ratepernight = data.data.ratepernight;
        this.filterSearchAjaxData.bookingtype = data.data.bookingtype;
        this.filterSearchAjaxData.offset = 0;
        this.filterSearchAjaxData.limit = 5;
        this.filterSearchAjaxData.firstTimeLoading = false;

        this.offsetLimit = 0;
        this.filterSearchAjax(this.filterSearchAjaxData, "");
      }
    });
    return await modal.present();
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
      if (this.router.url === "/home/tabs/jobs-tab/view-jobs") {
        this.navCntl.navigateRoot("/home/tabs/sitter-listing");
      }
    });
  }

  loadData(infiniteScroll) {

   
    if (this.isJobSearch) {
      this.offsetLimit = this.offsetLimit + this.jobpostingSearchData.limit;
      this.searchJobs(this.jobpostingSearchData,infiniteScroll);

    } else if (this.isfilterJob) {
      this.filterSearchAjax(this.filterSearchAjaxData, infiniteScroll);
    }else{
    }
  }

  async socialShare(petImage, petName, shareURL) {
    const modal = await this.modelCtrl.create({
      component: SocailshareComponent,
      animated: true,
      cssClass: "modalCss",
      componentProps: {
        description:
          "Check out this cute pet job on PetCloud! Earn up to $200. ",
        petImage: petImage,
        link: "",
        shareURL,
        shareType: "View Jobs",
      },
    });
    return await modal.present();
  }
}
