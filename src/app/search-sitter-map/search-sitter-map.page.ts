import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject } from '@angular/core';
import { IonSlides, ModalController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Map, tileLayer, marker, icon } from "leaflet";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { SitterSearchFilterComponent } from '../sitter-search-filter/sitter-search-filter.component';
import { DatePipe, DOCUMENT } from '@angular/common';


@Component({
    selector: 'app-search-sitter-map',
    templateUrl: './search-sitter-map.page.html',
    styleUrls: ['./search-sitter-map.page.scss'],
})
export class SearchSitterMapPage implements OnInit {
    @ViewChild('Map', { read: true }) mapElement: ElementRef; // get map element
    @ViewChild('sitterSlide', { read: true }) slider: IonSlides; // get ion-slides

    public location = { lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }; // dynamic location lat & lng
    public markerOptions: any = { position: null, map: null, title: null };
    public marker: any;
    map;
    startMinDate: any;
    googleSearchPlaceName: ""
    requestForGPSPremission:boolean = true
    searchFrm = {
        "lat": "",
        "lng": "",
        "distance": "",
        "serviceTypeId": "",
        "hostAttributes": "",
        "hostSkills": "",
        "pickUp": "",
        "property_type": "",
        "ratepernight": "",
        "samePetType": "",
        "spacesPet": "",
        "backyard_type": "",
        "breed": [],
        "dropOff": "",
        "samePetBreed": "0",
        "samePetSize": "0",
    };

    options = {
        types: ['(regions)'],
        componentRestrictions: { country: "AU" },
        bounds: null,
        fields: null,
        strictBounds: null,
        origin: null
    };

    public entries = []; // store map entries
    public entriesLocation = [];

    constructor(protected storage: Storage, public api: PetcloudApiService,
        public zone: NgZone,
        public modalCtrl: ModalController,
        public router: Router, public navCtrl: NavController,
        public geolocation: Geolocation,
        private diagnostic: Diagnostic,
        public androidPermission: AndroidPermissions,
        public locationAccuracy: LocationAccuracy,
        public platform: Platform,
        public route: ActivatedRoute,
        @Inject(DOCUMENT) private _document,) {
        this.startMinDate = new Date(new Date()).toISOString();

        this.route.queryParams.subscribe(async (params) => {

            if (params.lat != "") {
                this.searchFrm.lat = await params.lat;
                this.searchFrm.lng = await params.long;
                this.googleSearchPlaceName = await params.locationName;
                this.searchMap();
            } else if (params.lat == "") {

                this.isLocationAuthorized();
            }
        });

    }

    ngOnInit() {
    }

    //Check if application having Location Authorization
    async isLocationAuthorized() {
        await this.platform.ready();
        this.diagnostic.isLocationEnabled().then((isEnabled: any) => {
            if (isEnabled) {
                this.diagnostic.isLocationAuthorized().then((success: any) => {
                    if (success) {
                        this.requestForGPSPremission = true;
                        this.getLocationAccuracy();
                    } else {
                        this.requestForGPSPremission = false;
                    }
                }, err => {
                })
            } else {
                this.requestForGPSPremission = false;
            }

        }, err => {
           
        })
    }

    async getLocationAccuracy() {
        await this.platform.ready();
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (response_gps) => {
                // When GPS Turned ON call method to get Accurate location coordinates
                if (this.searchFrm.lat != "") {
                    this.searchMap()
                } else {
                    this.getCurrentLatLong();
                }
            },
            error => {
            }
        );
    }
 
    public dismissModal() {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
    }

    handleAddressChange(event) {
        this.searchFrm.lat = event.geometry.location.lat();
        this.searchFrm.lng = event.geometry.location.lng();
        this.searchMap();
    }
    /**
    * Load Map
    */
    public loadMap() {
        // if (this.map) {
        //     this.map.off();
        //     this.map.remove();
        //     this.map = this._document.getElementById('map').innerHTML = "<div id='map' style='height: 100%;'></div>";
        // }
        this.clearMap();
        let self = this;
        this.map = new Map("map").setView([this.searchFrm.lat, this.searchFrm.lng], 14);
        tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            minZoom: 10,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.entries.forEach((location) => {
            const customMarkerIcon = icon({
                iconUrl: "assets/img/petcloud_pin.svg",
                iconSize: [50, 50],
                popupAnchor: [0, -20],
            });
            marker([location.lat, location.lng], {
                icon: customMarkerIcon,
            })

                .bindPopup(
                    `<div data-sitterId="${[location.id]}" class="card">
                            <div class="profile-img">
                                <img src="${location.imagename}">
                            </div>
                            <div class="profile-caption">
                                 <h5 class="title">${location.title}</h5>
    
                            <div class="Stars" style="--rating: ${location.rating};"> </div>
                                <p class="sub-title">${location.first_name} ${location.last_name} </p>
                                <p class="amount">Starts from $ ${location.minPrice}</p>
                            </div>
                        </div>`

                ).addTo(this.map)
                .on("popupopen", async (e) => {

                    let sitterData = self._document.getElementsByClassName("card")


                    // // Sitter Details
                    for (var i = 0, len = sitterData.length; i < len; i++) {
                        sitterData[i].onclick = navigateToSitterDetails;
                    }

                    async function navigateToSitterDetails() {
                        let sitterId = await this.getAttribute("data-sitterId");
                        self.gotoSitterDetails(sitterId)
                    }
                })
        })
    }

    clearMap() {
        if (this.map) {
            this.map.off();
            this.map.remove();
            this.map = this._document.getElementById('map').innerHTML = "<div id='map' style='height: 100%;'></div>";
        }
    }


    async getCurrentLatLong() {
        await this.geolocation.getCurrentPosition().then(async (resp) => {
            this.searchFrm.lat = await resp.coords.latitude.toString()
            this.searchFrm.lng = await resp.coords.longitude.toString();
            this.searchMap();
        });
    }


    public searchMap() {
        this.api.showLoader();

        this.api.searchInMap({ SearchForm: this.searchFrm })
            .pipe(
                finalize(() => {
                    this.api.hideLoader();
                })
            )
            .subscribe(async (res: any) => {
                console.log("entries res", res);
                this.entries = [];
                if (res.success) {
                    this.entries = await res.entries;
                    if (this.entries.length > 0) {


                        this.loadMap();
                        console.log("entries", this.entries);
                    } else {
                        this.clearMap();
                        // this.api.showToast('no near by sitters found', 2000, 'bottom');
                    }
                } else {
                    this.clearMap();
                    // this.api.showToast('no near by sitters found', 2000, 'bottom');
                }
            }, (err: any) => {
                this.entries = [];
                this.api.autoLogout(err, { SearchForm: this.searchFrm })
            });
    }


    /**
    * Open Filter page using Model
    */
    async presendFilterModal() {
        const modal = await this.modalCtrl.create({
            component: SitterSearchFilterComponent
        });

        modal.onDidDismiss()
            .then((data) => {

                this.searchFrm.distance = data.data.distance;
                this.searchFrm.serviceTypeId = data.data.serviceTypeId;
                this.searchFrm.pickUp = new DatePipe('en-US').transform(data.data.pickUp, 'EEE dd MMM y');;
                this.searchFrm.dropOff = new DatePipe('en-US').transform(data.data.dropOff, 'EEE dd MMM y');
                this.searchFrm.spacesPet = data.data.spacesPet;
                this.searchFrm.samePetType = data.data.samePetType;
                this.searchFrm.samePetBreed = data.data.samePetBreed;
                this.searchFrm.samePetSize = data.data.samePetSize;
                this.searchFrm.ratepernight = data.data.ratepernight.lower + "," + data.data.ratepernight.upper;
                this.searchFrm.breed = data.data.breed;
                this.searchFrm.property_type = data.data.property_type;
                this.searchFrm.backyard_type = data.data.backyard_type;
                this.searchFrm.hostSkills = data.data.hostSkills;
                this.searchFrm.hostAttributes = data.data.hostAttributes;

                this.searchMap();

            });
        return await modal.present();
    }

    public convertNumberToArray(number: any) {
        return new Array(number);
    }

    public gotoSitterDetails(userId: any) {
        this.router.navigate(['/pet-sitter-detail', userId]);
    }

}