import { Component, OnInit, ElementRef, Inject, NgZone, ViewChild } from '@angular/core';
import { ActionSheetController, NavController, ModalController, IonSlides, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from "@angular/common";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { User } from '../model/user';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Map, tileLayer, marker, icon } from 'leaflet';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CustomMapPopupComponent } from '../custom-map-popup/custom-map-popup.component';
// import { Slides } from 'ionic-angular';
import { CameraService } from '../camera-service.service';
import { Camera} from "@ionic-native/camera/ngx";

@Component({
  selector: 'app-directory-listing-details',
  templateUrl: './directory-listing-details.page.html',
  styleUrls: ['./directory-listing-details.page.scss'],
})
export class DirectoryListingDetailsPage implements OnInit {
  
  @ViewChild("slides") slides: IonSlides;
   
  listingTabs: any;
  myImageUrl:any = null;
  reviewSegment: boolean = false;
  isMapLoaded: boolean = false;
  isAPILoaded: boolean = false;
  isFeatureArrayExists: boolean = false;

  listingName: any = "";
  listingId: any = "";
  serviceName: any = "";
  coverPhoto: any;
  details: any;
  listingDetails: any;
  reviewsList: any;
  placeHolderImage: any = "";
  map;
  isFavourite = 1;
  latLng = { lat: "", lng: "", catId: "" }
 
  userCurrentLatLong = { lat: null, lng: null } 
  public reviewForm: FormGroup;
  isFixed: boolean = false;
  
  constructor(
    public activatedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    public api: PetcloudApiService,
    public nav: NavController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private zone: NgZone,
    @Inject(DOCUMENT) private _document,
    public model: ModalController,
    public elementRef: ElementRef,
    private geolocation: Geolocation,
    public cameraAPI:CameraService,
    public camera:Camera,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
    this.isMapLoaded = false;
  }

  slideOpts = {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
  };

  ngOnInit() {
    this.listingTabs = "overview"
    this.isMapLoaded = false;
    this.reviewForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      comment: ["", [Validators.required]],
      serviceRating: ["", [Validators.required]],
      valueofMoneyRating: ["", [Validators.required]],
      locationRating: ["", [Validators.required]],
      cleanRating: ["", [Validators.required]],
    });
    this.getInfo();
    
  }

  ionViewDidEnter() {
    this.myImageUrl = null
    this.isMapLoaded = false;
    this.activatedRoute.queryParams.subscribe(async params => {
      this.listingId = await params.listingId;
      this.listingName = await params.listingName;
      this.serviceName = await params.serviceName;
      
      this.getCurrentLocation();
      this.getCategories();
    });
  }
  ionViewWillLeave() {
    if(this.map){
      this.map.off();
      this.map.remove();
    }
  }

  writeaReview(){
    this.reviewSegment = true
    this.listingTabs = "review"
  }


  // Get Categories for placeholder Image
  getCategories() {
    fetch("../../assets/JSON/dashboard.json").then(res => res.json()).then(json => {

      json.forEach(element => {
        if (element.serviceName === this.listingName) {
          this.placeHolderImage = element.coverPhoto;
        }
      });
  
      this.getListingDetails(this.listingId);
    });
  }

  getListingDetails(listingId) {
    this.api.showLoader();
    this.api.getDashboardListingDetail(listingId).pipe(
      finalize(() => {
        this.api.hideLoader();
      })).subscribe(async (response: any) => {
        this.isAPILoaded = true;
        if (response.success) {
          if (response.lising_data) {
            this.listingDetails = await response.lising_data;
            this.serviceName = this.listingDetails.category;
            const list = Array.isArray(this.listingDetails.feature_categories) ? this.listingDetails.feature_categories : [];
            list.length > 0 ? this.isFeatureArrayExists = true : this.isFeatureArrayExists = false;    
            this.reviewsList = await response.comments;
            this.isMapLoaded = false;
            if (this.listingDetails.latitude != "" || this.listingDetails.latitude != null) {
             
          
              await this.initMap(this.listingDetails.latitude,
                  this.listingDetails.longitude, this.listingDetails.map_icon,
                  this.listingDetails.title, this.listingDetails.cover_image,
                  this.listingDetails.address
                );
            } else {
              this.isMapLoaded = true;
              this.api.showToast("No Data to load map", "3000", "bottom")
            }
          } else {
            this.api.showToast("No Listing Details available", 3000, "bottom");
            this.nav.pop();
          }
        } else {
          this.api.showToast("No Listing Details available", 3000, "bottom");
          this.nav.pop();
        }
      }, err => {
        this.isAPILoaded = true;
        this.api.autoLogout(err,listingId);
        
      })
  }

  segmentChanged(event) {
    event.detail.value == "review" ? this.reviewSegment = true : this.reviewSegment = false;
  }

  openSocialSharing(url){
    this.api.openExteralLinks(url);
  }


  async showActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Profile Photo From',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.photoOption(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Gallery',
        handler: async () => {
          const status = await this.cameraAPI.checkPhotoLibraryPermission();
          if(status) {
            this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      }, {
        text: 'Cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  public convertNumberToArray(number: any) {
    return new Array(number);
  }

  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

  photoOption(params) {

    this.cameraAPI.getPicture(params).then((imageData:any)=>{
      this.myImageUrl = 'data:image/jpeg;base64,' + imageData;
    },err=>{
      
    })
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then((user: User) => {
      this.reviewForm.patchValue({
        email: user.email,
        name: user.first_name + " " + user.last_name
      })
    })
  }

  initMap(latitude,
    longitude,map_icon,
    title, cover_image,
    address) 
  {
     if (this.map) {
       console.log("inside removing map")
        this.map.off();
        this.map.remove();
        this.map = null;
     }
     var container = L.DomUtil.get('mapdiv');
     if (container != null) {
         container.outerHTML = ""; // Clear map generated HTML
         // container._leaflet_id = null; << didn't work for me
     }

     const customMarkerIcon = icon({
      iconUrl: map_icon == '' ? '../../assets/icon/pin.svg' : map_icon,
      iconSize: [50, 50],
      popupAnchor: [0, -20],
    })

    setTimeout(() => {
      this.api.hideLoader();
      this.map = new Map("mapdiv").setView([latitude, longitude], 14);
      
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        minZoom: 10,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      
      this.isMapLoaded = true

      marker([latitude, longitude], {
        icon: customMarkerIcon,
      })
      .addTo(this.map)
      .bindPopup('')
      .on("popupopen", async (e) => { 
        console.log("EVENT" , e)
        const modal = await this.model.create({
          component: CustomMapPopupComponent,
          animated: true,
          cssClass: "modalCss",
          componentProps: {
            listingData: this.listingDetails,
            currentLatLong:this.userCurrentLatLong
          },
        });
        modal.onDidDismiss().then((data: any) => { 
          if(e?.target){
            e.target.closePopup();
          }
        });
        return await modal.present();
      });
    }, 5000);
   }

  goToReviews(){
    this.listingTabs = "review"
  }

  getCurrentLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
    this.userCurrentLatLong.lat =  resp.coords.latitude
    this.userCurrentLatLong.lng =  resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
}

  makeCall(){
    if(this.listingDetails.hasOwnProperty("phone")  != ""){
      this.callNumber.callNumber(this.listingDetails.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => this.api.showToast("Error in opening dailer","3000","bottom"));
      }else{
        this.api.showToast("We don't have mobile number for this listing","3000","bottom")
      }
    }

  

  async goToGoogleMap(){
    if(this.listingDetails.hasOwnProperty("latitude")  != ""){
      var coords=this.listingDetails.latitude + ',' + this.listingDetails.longitude
      var q;
      if (this.platform.is("ios")) {
        q = 'maps://maps.apple.com/?q=' + coords;
      } else {
        q = 'geo:' + coords + '?q=' + coords;
      }
      q = q.replace(' ', '');
      window.location.href = q;
    }else{
      this.api.showToast("We don't have location for this listing","3000","bottom")
    }
  }

  goToWebiste(){
    if(this.listingDetails.hasOwnProperty("website")  != ""){
      this.api.openExteralLinks(this.listingDetails.website)
  }else{
    this.api.showToast("We don't have website for this listing","3000","bottom")
  }
}

  
  saveAsBookMark(listingId,isClicked) {
    let params = {
      bookmark: isClicked,
      listing_id:listingId
    };
    
    this.api.bookmarkListing(params).subscribe(
      (data: any) => {
        if(data.success){
      //     this.api.showToast(data.message,3000,"bottom")
        }
      },
      (err) => {
        this.api.autoLogout(err,params);
      }
    );
  }

  addReview() {

    let avgRating;

    avgRating = (this.reviewForm.value.serviceRating +  this.reviewForm.value.valueofMoneyRating + 
      this.reviewForm.value.locationRating +  this.reviewForm.value.cleanRating) / 4;


    console.log("myImageUrl",this.myImageUrl);
    const review = {
      post_id: this.listingId,
      name:this.reviewForm.value.name,
      email:this.reviewForm.value.email,
      content:this.reviewForm.value.comment,
      rating:avgRating,
      data:this.myImageUrl == null ? "" :  this.myImageUrl,
      img_name:this.myImageUrl == null ? "" : this.api.generateRandomId(7) + ".jpg" 
    };

    this.api.showLoader();
    this.api.listingAddReviews(review).subscribe(
      (data: any) => {
        this.api.hideLoader()
        if(data.success){
          this.api.showToast("Review Added Successfully",3000,"bottom");
          this.getListingDetails(this.listingId);
        }else{
          this.api.showToast("Failed to add review, please try again later.",3000,"bottom");
        }
      },
      (err) => {
        this.api.hideLoader()
        this.api.autoLogout(err,review);
      }
    );
  }

  scrollContent(event) {
    const value = event.detail.scrollTop;
    if (event.detail.scrollTop > 390) {
      this.isFixed = true;
    } else {
      this.isFixed = false;
    }
  }

}
