import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../app/api/petcloud-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController, Platform, NavController, LoadingController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { User } from '../model/user';
import { SitterSearchFilterComponent } from '../sitter-search-filter/sitter-search-filter.component';
import { DatePipe } from '@angular/common';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { SocailshareComponent } from '../socailshare/socailshare.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AnalyticsService } from '../analytics.service';
import { Events } from '../events';
import { PostJobPage } from '../post-job/post-job.page';
import { PostEnquiryComponent } from '../components/post-enquiry/post-enquiry.component';


@Component({
    selector: 'app-sitter-listing',
    templateUrl: './sitter-listing.page.html',
    styleUrls: ['./sitter-listing.page.scss'],
})
export class SitterListingPage implements OnInit {

    isModelClick: boolean = false;
    isLocationSearchHeader: boolean = false;
    userName: any = "";
    isHeaderVisbile: boolean = true
    @ViewChild(IonContent) content: IonContent;
    public sitterParams: any = {
        lat: '', lng: '', location: '', suburb: '', state: '', offset: '', limit: '', serviceTypeId: '',
        pickUp: '', dropOff: '', spacesPet: '', sml_dogs: '', med_dogs: '', lrg_dogs: '', gnt_dogs: '', samePetType: '',
        samePetBreed: '', samePetSize: '', breed: '', distance: '', ratepernight: '',
        property_type: '', backyard_type: '',
        hostSkills: '', hostAttributes: '', sorts: 'rating'
    };

    public hostSkills: any = [];
    public sittersList: any = [];
    public isNoSitterFound: boolean = false;
    public offSet = 0;
    public hideLoader: boolean = true;
    public previousUrl: any;
    @ViewChild('places') places: GooglePlaceDirective;
    @ViewChild('search') public searchElement: ElementRef;
    public isHidePagination: boolean = false;
    public googleSearch: any;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    public favSitter = { 'minderid': '', 'type': '' };
    private routingEvent = new Subscription();
    private apiEvent = new Subscription();
    private events: any;
    public isProfileUpdated = null;
    public listingServices: any;
    public userDetails: any = null;
    options = {
        types: ['(regions)'],
        componentRestrictions: { country: "AU" },
        bounds: null,
        fields: null,
        strictBounds: null,
        origin: null
    };
    public selectedFilter: any = {
        serviceTypeId: '',
        dropOff: '',
        pickUp: '',
        spacesPet: '',
        sml_dogs: '',
        med_dogs: '',
        lrg_dogs: '',
        gnt_dogs: '',
        samePetType: '0',
        samePetBreed: '0',
        samePetSize: '0',
        breed: '',
        distance: 25,
        ratepernight: { lower: '', upper: '' },
        property_type: '',
        backyard_type: '',
        hostSkills: '',
        similarPet: [],
        hostAttributes:[] ,
      };

    constructor(public EPEvent: Events,
        public modalCtrl: ModalController,
        public sideMenu: MenuController,
        protected storage: Storage,
        public router: Router,
        public api: PetcloudApiService,
        public loader: LoadingController,
        public navCtrl: NavController,
        public event: Events,
        public modelCtrl: ModalController,
        public platform: Platform,
        public geolocation: Geolocation,
        public diagnostic: Diagnostic,
        public firebaseAnalytics: AnalyticsService,
        public model:ModalController,
        public locationAccuracy: LocationAccuracy) {

        this.routingEvent = router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((e: any) => {

                
                this.previousUrl = e.url;
                storage.set("previousURL", this.previousUrl);
            });
        this.registerNetworkChange();
        if(this.platform.is("android")){
            this.getLocationAccuracy();
        }else if(this.platform.is("ios")){
            this.isLocationAuthorized()
        }else{
            this.defaultUserLocation()
        }
        this.events = EPEvent.subscribe('isFaviourate', (data) => {
            if (data.status == true) {
                this.offSet = 0;
                this.getSitters('');
                // this.getLocationAuthorization();
            }
        });
        EPEvent.publish('isFaviourate', {status: false, time: Date.now()});


        this.isProfileUpdated = event.subscribe("isProfileUpdated", (isUpdate) => {
            if (isUpdate.status == true) {
                this.getLocationAuthorization();
            }
        });
        event.publish('isProfileUpdated', {status: false, time: Date.now()});

        this.backButtonEvent();

    }

    ngOnInit() {
        this.getInfo()
    }


    ngOnDestroy() {
        this.events = null;
        if (this.routingEvent) {
            this.routingEvent.unsubscribe();
        }
        if (this.apiEvent) {
            this.apiEvent.unsubscribe();
        }
        this.isProfileUpdated = null;
    }

    async registerNetworkChange() {
        if(this.platform.is("cordova")){
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
    }

  

    //Check if application having Location Authorization
    async isLocationAuthorized() {
        try {
            await this.platform.ready();
            var result : string = await Promise.race([setTimeout(() => { return;}, 2000),
                this.diagnostic.requestLocationAuthorization()]);
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
        } catch (error) {
            console.log("isLocationAuthorized error", error)
        }
    }

    async getLocationAccuracy() {
        await this.platform.ready();
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (response_gps) => {
                this.getLocationAuthorization();
            },
            error => {
                this.getLocationAuthorization();
            }
        );
    }

    defaultUserLocation() {
        this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
            if (res != null) {
                await this.geoLocationPositionAPI(res.latitude, res.longitude);
            } else {
                await this.geoLocationPositionAPI(-33.8861, 151.2111);
            }
        })
    }

    async getLocationAuthorization() : Promise<any> {
        await this.platform.ready();
        await this.diagnostic.getLocationAuthorizationStatus().then(async authStatus => {
           
            if (authStatus == "authorized" || authStatus == "authorized_when_in_use"
                || authStatus == "GRANTED" || authStatus == "GRANTED_WHEN_IN_USE") {
                    let options = {timeout: 30000, enableHighAccuracy: false, maximumAge: 3600}

                await this.geolocation.getCurrentPosition(options).then(async (resp) => {
                     this.geoLocationPositionAPI(await resp.coords.latitude.toString(), resp.coords.longitude.toString())
                },err=>{
                    console.log("getCurrentPosition err", err)
                });
            } else {
                this.isLocationAuthorized();
            }
        })
    }


     goToSearchSitterMap() {
        if (this.userName == "") {
            this.router.navigate(["/search-sitter-map"], {
                queryParams: {
                    locationName: this.sitterParams.location,
                    lat: this.sitterParams.lat,
                    long: this.sitterParams.lng
                },
            });

        } else {
            this.router.navigate(["/search-sitter-map"], {
                queryParams: {
                    locationName: this.sitterParams.location,
                    lat: this.sitterParams.lat,
                    long: this.sitterParams.lng
                },
            });
        }
    }

    shortByFilter(filterName) {
        this.sitterParams.sorts = filterName.detail.value;
        this.sitterParams.offset = 0;
        this.offSet = 0;
        this.sitterParams.distance = 25,
            this.sitterParams.limit = 10;
        this.sittersList = [];

        this.getSitters('');
    }

    async getSitters(infinityScroll) {
        this.sitterParams.offset = this.offSet;
        if (this.hideLoader) {
            await this.api.showLoader();
        }
        this.apiEvent.add(this.api.searchSitter(this.sitterParams).pipe(finalize(() => {
            if (this.hideLoader) {
                this.api.hideLoader();
            }
            this.api.hideLoader();
            if (infinityScroll) {
                infinityScroll.target.complete();
            }

        })).subscribe((res: any) => {
            this.api.hideLoader()
            if (res.success) {
                const sitterData: any[] = res.entries;
                if (sitterData.length === 0) {
                    this.isHidePagination = true
                    if (this.sittersList == 0) {
                        this.isHidePagination = true
                        this.isNoSitterFound = true;
                    }
                } else if (sitterData.length > 0) {
                    this.isHidePagination = false;
                    this.isNoSitterFound = false;
                    for (const data of sitterData) {
                        if(this.sittersList?.length>0) {
                            let index = this.sittersList.findIndex((d)=> d.id == data.id);
                            if(index> -1) {
                                this.sittersList[index] = data;
                            } else {
                                this.sittersList.push(data);
                            }
                        } else {
                            this.sittersList.push(data);
                        }
                    }
                } else {
                    this.isHidePagination = false;
                    this.sittersList = [];
                    this.api.showToast('No More Sitter Found', 2000, 'bottom');
                }
            } else {
                this.isHidePagination = false;
                this.api.showToast("No Sitter Found", 2000, "bottom")
            }
        }, (err: HttpErrorResponse) => {
            this.isHidePagination = false;
            this.api.autoLogout(err, this.sitterParams);
            if (err.error instanceof Error) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('An error occurred:', err.error.message);
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
            }
        }));

    }

    loadData(infiniteScroll) {
        this.offSet = this.offSet + 10;
        this.hideLoader = false;
        this.infiniteScroll = infiniteScroll;
        this.getSitters(infiniteScroll);
    }

    public handleAddressChange(address: any) {

        this.googleSearch = address.address_components[0].long_name;;
        this.isHidePagination = true
        this.hideLoader = true;
        this.sittersList = [];
        this.offSet = 0;
        this.sitterParams.offset = this.offSet;
        this.sitterParams.limit = 10;
        this.sitterParams.lat = address.geometry.location.lat();
        this.sitterParams.lng = address.geometry.location.lng();
        this.sitterParams.location = address.address_components[0].long_name + " , " + address.address_components[2].long_name;
        this.sitterParams.suburb = address.address_components[0].long_name;
        this.sitterParams.state = address.address_components[2].long_name;
        this.sitterParams.distance = 25;

        this.getSitters('');
        this.changeLocation()
    }

    public async filter() {
        this.isModelClick = true
        const modal = await this.modalCtrl.create({
            component: SitterSearchFilterComponent,
            componentProps: {selectedFilter: this.selectedFilter}
        });
        modal.onDidDismiss()
            .then((data: any) => {
                this.isModelClick = false;
                if (data.data != undefined) {
                    this.sittersList = [];
                    this.selectedFilter = data.data;
                    this.sitterParams.distance = data.data.distance;
                    this.sitterParams.serviceTypeId = data.data.serviceTypeId;
                    this.sitterParams.pickUp = new DatePipe('en-US').transform(data.data.pickUp, 'EEE dd MMM y');;
                    this.sitterParams.dropOff = new DatePipe('en-US').transform(data.data.dropOff, 'EEE dd MMM y');
                    this.sitterParams.spacesPet = data.data.spacesPet;
                    this.sitterParams.sml_dogs = data.data.sml_dogs;
                    this.sitterParams.med_dogs = data.data.med_dogs;
                    this.sitterParams.lrg_dogs = data.data.lrg_dogs;
                    this.sitterParams.gnt_dogs = data.data.gnt_dogs;
                    this.sitterParams.samePetType = data.data.samePetType;
                    this.sitterParams.samePetBreed = data.data.samePetBreed;
                    this.sitterParams.samePetSize = data.data.samePetSize;
                    this.sitterParams.ratepernight = data.data.ratepernight.lower + "," + data.data.ratepernight.upper;
                    this.sitterParams.breed = data.data.breed;
                    this.sitterParams.property_type = data.data.property_type;
                    this.sitterParams.backyard_type = data.data.backyard_type;
                    this.sitterParams.hostSkills = data.data.hostSkills;
                    this.sitterParams.hostAttributes = data.data.hostAttributes;


                    this.getSitters('');
                }
            });
        return await modal.present();
    }

    public convertNumberToArray(number: any) {
        return new Array(number);
    }




    getInfo() {
        this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
            if (res != null) {
                this.userName = res.first_name;
                this.userDetails = res;
            }
        })
    }



    private async geoLocationPositionAPI(lat, long) {
        this.sitterParams.lat = lat
        this.sitterParams.lng = long;

        this.sitterParams.offset = 0;
        this.sitterParams.distance = 25,
            this.sitterParams.limit = 10;
        this.sittersList = [];
        await this.api.getSuburb(this.sitterParams.lat, this.sitterParams.lng).subscribe(async (response: any) => {
            this.googleSearch = await response.locality;
            this.sitterParams.suburb = await response.locality;
            this.sitterParams.location = await response.locality + ', ' + await response.principalSubdivision;
            this.sitterParams.state = await response.principalSubdivision;

            this.getListingServices();

            this.getSitters('');

        }, async err => {
            this.getSitters('');
            
        })
    }

    public getListingServices() {

        this.api.getSitterFilterDetails()
            .pipe(finalize(() => {
            }))
            .subscribe(async (res: any) => {
                this.listingServices = await res.Servicetype;
            }, (err: any) => {
                this.api.autoLogout(err, "")
            });
    }

    get getItems() {
        return this.listingServices.reduce((acc, curr) => {
          acc[curr.value] = curr;
          return acc;
        }, {});
      }
   

    goToDashboard() {
        this.router.navigateByUrl('/home/tabs/sitter-listing');
    }

    public async socialShare(link) {

        const modal = await this.modelCtrl.create({
            component: SocailshareComponent,
            animated: true,
            cssClass: 'modalCss',
            componentProps: {
                link
            }
        })
        return await modal.present();
    }

    selectService(event) {

        this.sittersList = [];
        this.sitterParams.serviceTypeId = event.detail.value;
        this.getSitters("");
    }


    updateFaviourateUnfaviourate(sitter) {


        this.favSitter.minderid = sitter.id;
        this.favSitter.type = sitter.isFavourite == true ? "unfavourite" : "favourite";

        this.api.sitterfavourite(this.favSitter)
            .subscribe((res: any) => {
                sitter.isFavourite == false ? sitter.isFavourite = true : sitter.isFavourite = false;
            }, (err: any) => {
                this.api.showToast('Error In Updating.', 2000, 'bottom');
                this.api.autoLogout(err, this.favSitter)
            });
    }

    async sendEmail() {
        this.api.sendEmailtoAccounts("marketing@petcloud.com.au","","","")
}

    addPetFriendlyLocation() {
        this.api.openExteralLinks("https://www.petcloud.com.au/d/add-listing/")
    }

    changeLocation() {
        this.isLocationSearchHeader = !this.isLocationSearchHeader;
    }

    // active hardware back button
    backButtonEvent() {

        this.platform.backButton.subscribe(async () => {

            this.api.dismissModelorAlert();
            if (this.router.url === "/home/tabs/sitter-listing" || this.router.url == "/home/tabs/sitter-listing") {

                if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                    navigator['app'].exitApp();
                } else {
                    this.api.showToast("Backpress again to exit app", "3000", "bottom")
                    this.api.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    }

    async sendEnquiry(sitter) {
        this.router.navigateByUrl("check-availability",{
        });
        return;
        const modal = await this.modelCtrl.create({
            component: PostEnquiryComponent,
            animated: true,
            componentProps: {
                sitter: sitter,
                isModalView: true
            }
        })
        return await modal.present();
    }
}
