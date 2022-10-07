import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  Inject,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { ModalController, Platform } from "@ionic/angular";
import { ListingCategoryComponent } from "../listing-category/listing-category.component";
import { Map, tileLayer, marker, icon, } from "leaflet";
import { finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { DOCUMENT } from "@angular/common";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SocailshareComponent } from "../socailshare/socailshare.component";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import * as L from 'leaflet';

@Component({
  selector: "app-directory-listing-map",
  templateUrl: "./directory-listing-map.page.html",
  styleUrls: ["./directory-listing-map.page.scss"],
})
export class DirectoryListingMapPage implements OnInit {
  mapPinsData: any = [];

  public data = { latitude: "", longitude: "", selected_cate: "", serviceName: "", locationName: "", distance: "" };
  map;
  public isDataFilter: boolean = false;
  public filterParams: any;
  requestForGPSPremission: boolean = true;

  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
  };
  isLoading: boolean = false;

  constructor(
    public api: PetcloudApiService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    public router: Router,
    public storage: Storage,
    public ngZone: NgZone,
    public callNumber: CallNumber,
    private modelCtrl: ModalController,
    public geolocation: Geolocation,
    private diagnostic: Diagnostic,
    public androidPermission: AndroidPermissions,
    public locationAccuracy: LocationAccuracy,
    public platform: Platform,
    @Inject(DOCUMENT) private _document,
    public elementRef: ElementRef
  ) {

    this.route.queryParams.subscribe(async (params) => {
      if (Object.keys(params).length === 0 != true) {
        this.data.locationName = params.locationName;
        this.data.latitude = params.latitude;
        this.data.longitude = params.longitude;
        this.data.selected_cate = params.selected_cate;
        this.data.distance = params.distance

        this.getMapsPin();
      } else {
        this.isLocationAuthorized();
      }
    });
  }

  ngOnInit(): void { };


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
      console.log("not available is location enabled", err);
    })
  }

  async getLocationAccuracy() {
    await this.platform.ready();
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      (response_gps) => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getCurrentLatLong();
      },
      error => {
        console.log("error in turn on gps", error);
      }
    );
  }


  ionViewDidLeave() {
    if (this.map?._panes?.markerPane) {
      this.map._panes.markerPane.remove();
      //this._document.getElementById("map").outerHTML = "";
    }
  }

  async getCurrentLatLong() {
    await this.geolocation.getCurrentPosition().then(async (resp) => {
      this.data.latitude = await resp.coords.latitude.toString()
      this.data.longitude = await resp.coords.longitude.toString();
      await this.api.getSuburb(this.data.latitude, this.data.longitude).subscribe(async (response: any) => {
        this.data.locationName = await response.locality;
      }, async err => {

      });
      this.getMapsPin();
    });
  }

  getMapsPin() {
    let param = {
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      distance: this.data.distance,
      selected_cate: this.data.selected_cate ? this.data.selected_cate : "",
    };
    console.log("getMap pins param", param);
    this.api.showLoader();
    this.isLoading = true;
    this.api
      .getMapPins(param)
      .pipe(
        finalize(() => {
          this.api.hideLoader();
          this.isLoading = false;
        })).subscribe(async (res: any) => {
          this.mapPinsData = [];
          if (res.success) {
            if (res.listing_data.length) {
              this.mapPinsData = await res.listing_data;
              // Set Map Lat Long to 1st Index in Leaflet
              this.data.latitude = await this.mapPinsData[0]._geolocation_lat;
              this.data.longitude = await this.mapPinsData[0]._geolocation_long;

              this.initMap(await this.mapPinsData);

            } else {
              this.clearMap();
              // this.api.showToast("No Data Found", "3000", "bottom");
            }
          } else {
            this.clearMap();
            this.api.showToast("No Data Found", "3000", "bottom");
          }
          this.isLoading = false;
          this.api.hideLoader();
        });
  }

  clearMap() {
    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
      } catch (error) {
        
      }
      this.map = null;
      this.map = this._document.getElementById('map').innerHTML = "<div id='map' style='height: 100%;'></div>";
    }
  }
  initMap(locations) {

    this.clearMap();
    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }

    let self = this;
    this.map = new Map("map").setView([this.data.latitude, this.data.longitude], 8);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 11,
      zoom: 10,
      center:[this.data.latitude, this.data.longitude],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);


    locations.forEach((location) => {
      location.isClicked = 0
      const customMarkerIcon = icon({
        iconUrl: location.map_icons,
        iconSize: [50, 50],
        popupAnchor: [0, -20],
      });
      location['isIOS'] = this.platform.is('ios');
      marker([location._geolocation_lat, location._geolocation_long], {
        icon: customMarkerIcon,
      })
        .bindPopup(
          `<div class="map-popup-container">
          <div class="event-img"><img src="${location.image}"></div>
          <div class="event-details">
            <a 
            data-category="${[location.category]}"
            data-listing_id="${[location.listing_id]}"
            data-title="${[location.listing_title]}"
            class="partner-link">${location.listing_title}</a>
            <h4 class="event-address">${location._address}</h4>
            <div class="action-btn">
                <ul>
                    <li class="location" 
                     data-lat="${[location._geolocation_lat]}"
                     data-long="${[location._geolocation_long]}" tappable >
                      <ion-icon style="width: 1.5rem;height: 1.5rem;" name="navigate-circle"></ion-icon>
                    </li>
                      
                    <ng-container ${[location.hasOwnProperty("_phone") == false ? 'style="display: none;"' : "",]}">
                       <li class="call" data-call="${location._phone}" tappable >
                        <ion-icon style="width: 1.5rem;height: 1.5rem;" name="call"></ion-icon> 
                      </li>
                    </ng-container>
                   
                    <ng-container>
                      <li class="save" 
                      data-isClicked = "${location.bookamrked}"
                      data-listId="${[location.listing_id]}"
                      data-title="${[location.listing_title]}" tappable>
                      
                      <ng-container
                      ${[location.hasOwnProperty("bookamrked") == 0 ? 'style="width: 1.5rem;height: 1.5rem; color: red"' : 'style="width: 1.5rem;height: 1.5rem;']}">
                      <ion-icon style="width: 1.5rem;height: 1.5rem;"
                      name="heart"></ion-icon>
                    </ng-container>
                  
                   </li>

                </ng-container>
                    <li
                        class="share"
                        data-category="${[location.category]}"
                        data-title="${[location.listing_title]}"
                        data-lat="${[location._geolocation_lat]}"
                        data-long="${[location._geolocation_long]}"
                        
                        tappable>
                        <ion-icon style="width: 1.5rem;height: 1.5rem;" name="share"></ion-icon> 
                    </li>
              </ul>
           </div>
       </div>
      </div>`
        ).addTo(this.map)
        .on("popupopen", async (e) => {
          let listingTitle = self._document.getElementsByClassName("partner-link")
          let locationData = self._document.getElementsByClassName("location");
          let mobileNumberData = self._document.getElementsByClassName("call");
          let saveData = self._document.getElementsByClassName("save");
          let shareData = self._document.getElementsByClassName("share");



          // Listing Title
          for (var i = 0, len = listingTitle.length; i < len; i++) {
            listingTitle[i].onclick = navigateToListingDetail;
          }

          // Map Navigation
          for (var i = 0, len = locationData.length; i < len; i++) {
            locationData[i].onclick = navigateToGoogleApp;
          }

          // Mobile Number
          for (var i = 0, len = mobileNumberData.length; i < len; i++) {
            mobileNumberData[i].onclick = navigateToMobileNumber;
          }

          // Book mark
          for (var i = 0, len = saveData.length; i < len; i++) {
            saveData[i].onclick = navigateToBookmark;
          }

          // Share Data
          for (var i = 0, len = shareData.length; i < len; i++) {
            shareData[i].onclick = navigateToShare;
          }


          async function navigateToListingDetail() {

            let cat_title = this.getAttribute("data-title");
            let category = this.getAttribute("data-category");
            let listingId = this.getAttribute("data-listing_id");



            self.router.navigate(["/directory-listing-details"], {
              queryParams: {
                listingName: cat_title,
                listingId: listingId,
                serviceName: category
              },
            });

          }

          async function navigateToShare() {
            let latitude = this.getAttribute("data-lat");
            let langitude = this.getAttribute("data-long");
            let catName = this.getAttribute("data-category");
            let cat_title = this.getAttribute("data-title");

            let shareMessage =
              "Check out this AWESOME " +
              cat_title +
              " spot I found on PetCloud!" +
              "link";

            const modal = await self.modelCtrl.create({
              component: SocailshareComponent,
              animated: true,
              cssClass: "modalCss",
              componentProps: {
                description: shareMessage,
                shareType: "directory-listing-map",
              },
            });
            return await modal.present();
          }

          function navigateToBookmark() {
            let list_Id = this.getAttribute("data-listId");

            locations.forEach(element => {
              if (element.listing_id == list_Id) {
                if (element.bookamrked == 0) {
                  element.bookamrked = 1
                  this.setAttribute("style", "color: red")
                  self.saveAsBookMark(list_Id, 1);
                } else {
                  element.bookamrked = "0"
                  this.setAttribute("style", "width: 1.5rem;height: 1.5rem;")
                  self.saveAsBookMark(list_Id, 0);
                }
              }
            });

          }

          async function navigateToMobileNumber() {
            let mobileNumber = await this.getAttribute("data-call");
            if (mobileNumber == "undefined") {
              self.api.showToast(
                "Mobile number not provided, sorry for inconvience caused",
                "3000",
                "bottom"
              );
            } else {
              self.callNumber
                .callNumber(mobileNumber, true)
                .then((res) =>
                  self.api.showToast("Please Wait", "3000", "bottom")
                )
                .catch((err) =>
                  self.api.showToast(
                    "Error in Launching Dailer",
                    "3000",
                    "bottom"
                  )
                );
            }
          }

          function navigateToGoogleApp() {
            let latitude = this.getAttribute("data-lat");
            let langitude = this.getAttribute("data-long");

            var coords= location._geolocation_lat + ',' + location._geolocation_long;
            var q;
            if (location.isIOS) {
              q = 'maps://maps.apple.com/?q=' + coords;
            } else {
              q = 'geo:' + coords + '?q=' + coords;
            }
            q = q.replace(' ', '');
            window.location.href = q;
          }
        });
    });
  }

  saveAsBookMark(listingId, isClicked) {

    let params = {
      bookmark: isClicked,
      listing_id: listingId
    };

    this.api.bookmarkListing(params).subscribe(
      (data: any) => {
        if (data.success) {
          //     this.api.showToast(data.message,3000,"bottom")
        }
      },
      (err) => {
        this.api.autoLogout(err, params);
      }
    );
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: ListingCategoryComponent,
      animated: true,
      componentProps: {
        data: this.data
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data == "no") {
        this.isDataFilter = false;
      } else {
        this.isDataFilter = true;
        this.filterParams = data.data;
        this.data.serviceName = data.data.categoryName
        this.data.distance = data.data.distance
        this.data.latitude = data.data.latitude;
        this.data.longitude = data.data.longitude;
        this.data.selected_cate = data.data.selected_cate;
        this.data.locationName = data.data.locationName;
        this.mapPinsData = [];
        this.getMapsPin();
      }
    });
    return await modal.present();
  }

  async handleAddressChange(address) {
    this.data.latitude = await address.geometry.location.lat();
    this.data.longitude = await address.geometry.location.lng();
    this.data.locationName = address.address_components[0].long_name + " , " + address.address_components[2].long_name;
    if (this.map) {
      this.map._panes.markerPane.remove();
    }

    this.getMapsPin();
  }

  goTodirectory() {
    this.router.navigateByUrl("/home/tabs/explore");
  }

  async goToMapView() {

    this.data.serviceName = this.data.serviceName == "" ? "Pet Friendly Places" : this.data.serviceName;
    await this.router.navigate(["/directory-listing"], {
      queryParams: {
        data: JSON.stringify(this.data)
      },
    });
  }
  openDiagnosticSettings() {

  }
}
