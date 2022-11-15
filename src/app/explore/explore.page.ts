import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { filter, finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { User } from '../model/user';
import { JobDetailComponent } from '../view-jobs/job-detail/job-detail.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx"
import { Subscription } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AnalyticsService } from '../analytics.service';
import { DrawerState } from 'ion-bottom-drawer';
import { CategoryListComponent } from '../components/category-list/category-list.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  type = "sitters";
  userName: any = "";
  userImage:any = "";
  userDetails: any;
  exploreData: any;
  jobsData = [];
  suburbName: any = ""
  categories: any = [];
  public location = { lat: "", long: "" }
  googleSearch: any = ""

  shouldBounce = true;
  dockedHeight = 500;
  distanceTop = 200;
  drawerState = DrawerState.Docked;
  states = DrawerState;
  minimumHeight = 500;
  isDrawerVisible: boolean = false;

  private routeExploreSubscription = new Subscription();
  private apiSubscription = new Subscription();
  public isLocationSearchHeader: boolean = false;

  options = {
    types: ['(regions)'],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
};

sliderOpts = {
  slidesPerView: "auto"
}


  constructor(protected storage: Storage, public api: PetcloudApiService,
    public router: Router, private modalCtrl: ModalController,
    public platform: Platform,
    public geolocation: Geolocation,
    public navCntl: NavController,
    public diagnostic: Diagnostic,
    public analytics: AnalyticsService,
    public backgroundMode: BackgroundMode,
    public locationAccuracy: LocationAccuracy) {
      
    this.backButtonEvent()
    this.categories = []
    this.isDrawerVisible = false;
    this.exploreData = null;
    this.type = 'sitters';

    this.registerNetworkChange();
    this.getInfo();
    if(this.platform.is("android")){
      this.getLocationAccuracy();
    } else if(this.platform.is("ios")){
      this.isLocationAuthorized()
    }
  }

  ngOnInit() {
     
  }

  ionViewWillEnter() {
    this.getInfo()
  }

  ngOnDestroy() {
    this.categories = []
    this.isDrawerVisible = false;
    this.routeExploreSubscription.unsubscribe();
    this.routeExploreSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  async registerNetworkChange() {
    let that = this;
    that.googleSearch = "";
    await this.platform.ready();
    this.diagnostic.registerLocationStateChangeHandler(function (state) {
            if (state == "location_off") {
                that.isLocationAuthorized();
              } else {
                that.getLocationAccuracy();
              }
    });
  }



  //Check if application having Location Authorization
   async isLocationAuthorized() {
    await this.platform.ready();
    this.diagnostic.requestLocationAuthorization();
    this.diagnostic.isLocationEnabled().then((isEnabled: any) => {
      if (isEnabled) {
          this.diagnostic.isLocationAuthorized().then((success: any) => {
            success ? this.getLocationAccuracy() :  this.defaultUserLocation()
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

   async getLocationAccuracy() {
    await this.platform.ready();
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      (response_gps) => {
        this.getExploreData();
      },
      error => {
        this.defaultUserLocation()
      }
    );
  }

   defaultUserLocation() {
    this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
        this.exploreAPI(res.latitude, res.longitude);
      }else{
        this.exploreAPI(-33.8861, 151.2111);
      }
    })
  }

  async getInfo() {
    await this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
        this.userName = res.first_name;
        this.userImage = res.imagename
        this.userDetails = res;
      }
    })
  }

  showHideIcon(){
      this.isLocationSearchHeader == true ? this.isLocationSearchHeader = false : this.isLocationSearchHeader = true;
  }

  public handleAddressChange(address: any) {

    this.googleSearch = address.address_components[0].long_name + " , " + address.address_components[2].long_name;
    
    this.exploreAPI(address.geometry.location.lat(), address.geometry.location.lng())
}

  goToDashboard() {
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {
      this.router.navigate(["/directory-listing-map"], {
        queryParams: {
          latitude: this.location.lat,
          longitude: this.location.long,
          locationName:this.googleSearch
        },
      });
    }
  }

  goToDirectoryListingMap() {
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {
      this.router.navigate(["/directory-listing-map"], {
        queryParams: {
          latitude: this.location.lat,
          longitude: this.location.long,
          locationName: this.googleSearch,
        },
      });
    }
  }

  addLocation(){
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {
      this.router.navigate(["/post-a-spot"]);
    }
  }

  async goToDashboardCategory(category) {
    const routerLink = category.routerLink;
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {
      if (category.name == "Pet Services") {
        this.router.navigate(["/home/tabs/sitter-listing"]);
      } else if (routerLink != "") {
        this.api.openExteralLinks(routerLink)
      } else {
        const data = {
          latitude: this.location.lat, longitude: this.location.long,
          selected_cate: category.id, serviceName: category.name, locationName: "", distance: ""
        };
        await this.router.navigate(["/directory-listing"], {
          queryParams: {
            data: JSON.stringify(data)
          },
        });
      }
    }
  }

  addPetFriendlyLocation() {
    this.api.openExteralLinks("https://www.petcloud.com.au/d/add-listing/")
  }

   async getExploreData() {
    if (this.platform.is("cordova")) {
      const location = { lat: "", lng: "" }
      // GRANTED and GRANTED_WHEN_IN_USE is for android.
      await this.platform.ready();
      this.diagnostic.getLocationAuthorizationStatus().then(authStatus => {
     
        if (authStatus == "authorized" || authStatus == "authorized_when_in_use"
          || authStatus == "GRANTED" || authStatus == "GRANTED_WHEN_IN_USE") {
          this.geolocation.getCurrentPosition().then(async (resp) => {

            // this.location.lat = await resp.coords.latitude.toString();
            // this.location.long = await resp.coords.longitude.toString();

            location.lat = await resp.coords.latitude.toString();
            location.lng = await resp.coords.longitude.toString();

            this.exploreAPI(location.lat, location.lng)
          })
        } else {
          // Location Permission Not Given
          this.defaultUserLocation();
        }
      })
    }else{
      this.defaultUserLocation();
    }
  }

  
   private exploreAPI(lat, long) {
    const locationData = { lat, lng:long }
    this.location.lat = lat;
    this.location.long = long;

    this.getSuburbName(lat, long)
    this.api.showLoader();
    this.apiSubscription.add(
      this.api.userExplore(locationData).pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe(async (res: any) => {
  
        if (res.status) {
          this.exploreData = await res.data;
          this.categories = await res.categories
        } else {
          this.api.showToast("No Data Available", "3000", "bottom")
        }
      }, err => {
        this.api.autoLogout(err, location);
      })
    )
   
  }

  getSuburbName(lat, long) {
    this.api.getSuburb(lat, long).subscribe((data: any) => {
      this.suburbName = data.locality;
    })
  }

  public convertNumberToArray(number: any) {
    return new Array(number);
  }

  goToListingDetail(data) {
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {

      this.router.navigate(["/directory-listing-details"], {
        queryParams: {
          listingName: data.listing_title,
          listingId: data.listing_id,
          serviceName: data.listing_title,
          locationName: ""
        },
      });
    }
  }


  reminders(param) {
    if (this.userName == "") {
      this.api.SignInWindow();
    } else {

      param == "add" ? this.router.navigateByUrl("/add-reminders") : this.router.navigateByUrl("/reminders-list")
    }
  }

  viewReminders() {

  }
  async showJobDetails(jobData) {

    if (this.userName == "") {
      this.api.SignInWindow();
    } else {
      const modal = await this.modalCtrl.create({
        component: JobDetailComponent,
        animated: true,
        componentProps: {
          jobId: jobData.jobId,
          earnUpto: jobData.earnUpTo,
          userId: jobData.userid,
        },
      });
      modal.onDidDismiss().then((data: any) => {

      });
      return await modal.present();
    }
  }

  segmentChanged(ev: any) {
  }

  async sendNotifyEmail() {

    if(this.userName == ""){
      this.api.SignInWindow();
    }else{
      this.api.sendEmailtoAccounts("marketing@petcloud.com.au",[""],'No Pet Sitters near by at ' + this.suburbName,this.userName + " has reported via the app that there are no sitters in his area of "+this.suburbName);
    }
  }

  

  async goToMessageDetails(reminder) {
    reminder.type == "booking" ?
      this.router.navigate(["/message-detail"], {
        queryParams: { id: reminder.id },
      }) : ""
  }

  async viewCategories(){
    // this.isDrawerVisible == true ? this.isDrawerVisible = false : this.isDrawerVisible = true;
    const modal = await this.modalCtrl.create({
      component: CategoryListComponent,
      animated: true,
      swipeToClose: true,
      mode: 'ios',
      backdropDismiss: true,
      componentProps: {categories: this.categories, userName: this.userName, location: this.location},
      cssClass: 'search-job-modal category-modal'
    });
    await modal.present();
    const resp = await modal.onDidDismiss();
    if(resp.role=="redirect") {
      this.goToDashboardCategory(resp.data)
    }
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

      this.api.dismissModelorAlert();
      if (this.router.url === "/home/tabs/explore") {
        this.navCntl.navigateRoot("home/tabs/sitter-listing")
      }
    });
  }

}
