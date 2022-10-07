import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetcloudApiService } from '../../../..//src/app/api/petcloud-api.service';
import { DatePipe, DOCUMENT } from "@angular/common";
import { ActionSheetController, AlertController } from '@ionic/angular';
import { CameraService } from '../../camera-service.service';
import { Camera } from "@ionic-native/camera/ngx";

@Component({
  selector: 'app-add-directory-listing',
  templateUrl: './add-directory-listing.page.html',
  styleUrls: ['./add-directory-listing.page.scss'],
})
export class AddDirectoryListingPage implements OnInit {

  isMapLoaded: boolean = false;
  map: any;
  newMarker: any;
  selectedSegment = "basicInfo";
  _listing_type: any = ""
  submitData: boolean = false;
  public activeCard = ['card-monday',
  'card-tuesday','card-wednesday','card-thursday','card-friday',
  'card-saturday'];
  public currentDate = ""
  public minDate = ""
  isChecked: boolean = false



  typeofbuisness = [{
    label: "Business",
    value: "Business"
  }, {
    label: "Non-Commercial free location",
    value: "Normal"
  }]
  states = [{
    name: "Queensland",
    value: "3702",
  }, {
    name: "New South Wales",
    value: "3703"
  }, {
    name: "Canberra",
    value: "3450"
  }, {
    name: "Victoria",
    value: "3450"
  }, {
    name: "Tasmania",
    value: "3705"
  }, {
    name: "South Australia",
    value: "3706"
  }, {
    name: "Western Australia",
    value: "3707"
  }, {
    name: "Northern Territory",
    value: "3708"
  }]

  private getState(stateName: string): any {
    switch (stateName) {
        case 'Queensland':
            return '3702';
            break;
        case 'New South Wales':
            return '3703';
            break;
        case 'Canberra':
            return '3450';
            break;
        case 'Victoria':
            return '3450';
            break;
        case 'Tasmania':
            return '3705';
            break;
        case 'South Australia':
            return '3706';
            break;
        case 'Western Australia':
            return '3707';
            break;
        case 'Northern Territory':
            return '3708';
            break;
        default:
            return '0';
    }
}

  bookableOpts = [{
    value: "onetime",
    label: "One time fee"
  }, {
    value: "byguest",
    label: "Multiply by guests"
  }, {
    value: "bydays",
    label: "Multiply by days"
  }, {
    value: "byguestanddays",
    label: "Multiply by guests & days"
  }]

  services = [];
  public completedProfileStep: number = 0;
  steps = []
  stepCount: number = 0
  isFormValid: boolean = false

  isSegmentEnabled = {
    isLocationEnabled: true, isGalleryEnabled: true, isDetailsEnabled: true,
    isSocialmediaEnabled: true, isOpeninghoursEnabled: true, isEventdatesEnabled: true,
  }

  public isLocationEnabled: boolean = false;

  public amenities: Array<any> = [];
  public addDirectoryForm: FormGroup;
  myImageUrl: any = "";
  constructor(private route: ActivatedRoute,
    public api: PetcloudApiService,
    public actionSheetCtrl: ActionSheetController,
    public CameraAPI: CameraService,
    public camera: Camera,
    public alertController: AlertController,
    public router: Router,
    @Inject(DOCUMENT) private _document,
    public formBuilder: FormBuilder) {
    this.route.queryParams.subscribe(async (params) => {
      this._listing_type = await params['spot'];

      if (this._listing_type == 56 || this._listing_type == 57) {
        this.steps = [...Array(6)].map((_, i) => ++i + "");
        this.stepCount = 6;
      } else {
        this.steps = [...Array(5)].map((_, i) => ++i + "");
        this.stepCount = 5;
      }
      this.getAminities(this._listing_type);
      this.currentDate =  new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy h:mm a');
      this.minDate = new Date().toISOString();
    });
  }


  options = {
    types: ['(regions)'],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
  };

  ngOnInit() {
    this.addDirectoryForm = this.formBuilder.group({

      listing_category: [this._listing_type, [Validators.required]],
      listing_title: ["", [Validators.required]],
      keywords: [""],
      _what_kind_of_listing_is_it: ["", [Validators.required]],
      listing_feature: [[]],
      address: ["", [Validators.required]],
      state: ["", [Validators.required]],
      _geolocation_long: ["", [Validators.required]],
      _geolocation_lat: ["", [Validators.required]],
      gallery: [
        {
          image: "",
          name: ""
        }
      ],
      description: ["", [Validators.required]],
      _email_contact_widget: [false],
      phone: [""],
      website: [""],
      email: [""],
      video: [""],
      facebook: [""],
      twitter: [""],
      youtube: [""],
      instagram: [""],
      whatsapp: [""],
      skype: [""],
      _price_min: [""],
      _price_max: [""],
      _monday_opening_hour: ["09:00"],
      _monday_closing_hour: ["20:00"],
      _tuesday_opening_hour: ["09:00"],
      _tuesday_closing_hour: ["20:00"],
      _wednesday_opening_hour:["09:00"],
      _wednesday_closing_hour: ["20:00"],
      _thursday_opening_hour: ["09:00"],
      _thursday_closing_hour:  ["20:00"],
      _friday_opening_hour: ["09:00"],
      _friday_closing_hour:  ["20:00"],
      _saturday_opening_hour: ["09:00"],
      _saturday_closing_hour:["20:00"],
      _sunday_opening_hour: ["09:00"],
      _sunday_closing_hour:["20:00"],
      _event_date: [],
      _event_date_end: [],
    })

  }

  ionViewDidEnter() {
  }

  onChangeAminities(event) {
    console.log("onChangeAminities", event)
    const aminityId = this.addDirectoryForm.controls['listing_feature'].value;
    console.log("onChangeAminities aminityId", aminityId)
    const index = this.addDirectoryForm.value.listing_feature.indexOf(aminityId);
    if (event.detail.checked) {
      if (index === -1) {
        this.addDirectoryForm.value.listing_feature.push(aminityId);
      } else {
        this.addDirectoryForm.value.listing_feature.splice(index, 1);
      }
    }
  }

  public handleAddressChange(address: any) {
    this.addDirectoryForm.patchValue({
      address: address.vicinity,
      _geolocation_long: address.geometry.location.lng(),
      _geolocation_lat: address.geometry.location.lat(),
      state: this.getState(address.address_components[2].long_name) == 0 ? "" :  this.getState(address.address_components[2].long_name)
    }) 
  }

  getAminities(id) {
    this.api.getAminities(id).subscribe(async (res: any) => {
      this.amenities = await res.amenities;

      this.addDirectoryForm.patchValue({
        listing_category: this._listing_type
      })

    }, err => {
    })
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Photo From',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.photoOption(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Gallery',
        handler: async () => {
          const status = await this.CameraAPI.checkPhotoLibraryPermission();
          if(status) {
            this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      }, {
        text: 'Cancel',

      }]
    });
    await actionSheet.present();
  }

  photoOption(params) {
    this.CameraAPI.getPicture(params).then((base64String: any) => {
      this.myImageUrl = 'data:image/jpeg;base64,' + base64String;
    }, err => {
    })
  }

  onMenuStatusChange(event) {
  }


  async submitListing() {
  
   
  
    const frmVal = this.addDirectoryForm.value;
    if (this.selectedSegment == "basicInfo") {
      if (frmVal.listing_category != "" && frmVal.listing_title != "" && frmVal._what_kind_of_listing_is_it != "") {
        if (this.completedProfileStep == 0) {
          this.completedProfileStep = 1
          this.isSegmentEnabled.isLocationEnabled = false;
          this.selectedSegment = "location"
        }
    }else if (frmVal.listing_category != ""  || frmVal.listing_title == "" || frmVal._what_kind_of_listing_is_it != "") {
        this.isSegmentEnabled.isLocationEnabled = false;
        this.selectedSegment = "basicInfo"
        this.addDirectoryForm.controls['listing_title'].markAsTouched();
        this.addDirectoryForm.controls['_what_kind_of_listing_is_it'].markAsTouched();
    }
    } else if (this.selectedSegment == "location") {

      if (frmVal.address != "" && frmVal.state != "") {
        this.completedProfileStep = 2 
        this.isSegmentEnabled.isGalleryEnabled = false;
        this.selectedSegment = "gallery"
      } else if (frmVal.address == ""  && frmVal.state == "") {
        this.addDirectoryForm.controls['address'].markAsTouched();
        this.addDirectoryForm.controls['state'].markAsTouched();
      }
    } else if (this.selectedSegment == "gallery") {
      this.isSegmentEnabled.isDetailsEnabled = false;
      this.completedProfileStep >= 3 ? "" : this.completedProfileStep = 3
      this.selectedSegment = "details"
    } else if (this.selectedSegment == "details") {
      if (frmVal.description != "") {
        this.isSegmentEnabled.isSocialmediaEnabled = false;
        this.completedProfileStep >= 4 ? "" : this.completedProfileStep = 4
        this.selectedSegment = "socialmedia";
      } else {
        this.addDirectoryForm.controls['description'].markAsTouched();
      }
    } else if (this.selectedSegment == "socialmedia" && !this.isChecked  ) {
      this.completedProfileStep >= 5 ? this.selectedSegment = "" : ""
      this.completedProfileStep >= 5 ? "" : this.completedProfileStep = 5
      
      if (this._listing_type == "56") {
        this.isSegmentEnabled.isEventdatesEnabled = false;
        this.selectedSegment = "eventdates"
      } else if (this._listing_type == "57") {
        this.isSegmentEnabled.isOpeninghoursEnabled = false;
        this.selectedSegment = "openinghours"
      }else{
        this.isChecked = true
      }
    } else if (this.selectedSegment == "eventdates" && !this.isChecked) {
      this.completedProfileStep >= 6 ? this.selectedSegment = "" : ""
      this.completedProfileStep >= 6 ? "" : this.completedProfileStep = 6
      this.isChecked = true
    } else if (this.selectedSegment == "openinghours" && !this.isChecked) {
      this.isChecked = true
      this.completedProfileStep >= 6 ? this.selectedSegment = "" : ""
      this.completedProfileStep >= 6 ? "" : this.completedProfileStep = 6
    } 
    else if(this.isChecked && this._listing_type == 56 || this._listing_type == 57 ? this.completedProfileStep == 6 : this.completedProfileStep == 5){
    
     

      if (this.addDirectoryForm.valid) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: 'Would you like to submit this listing?',
          buttons: [
            {
              text: 'Cancel',
            }, {
              text: 'Okay',
              handler: () => {

                console.log("frmVal._monday_opening_hour", frmVal._monday_opening_hour);

                this.api.showLoader();
               
                const listingFrm = {
                    listing_category: frmVal.listing_category,
                    listing_title: frmVal.listing_title,
                    keyword: frmVal.keywords,
                    _what_kind_of_listing_is_it: frmVal._what_kind_of_listing_is_it,
                    listing_feature: frmVal.listing_feature,
                    address: frmVal.address,
                    state: frmVal.state,
                    _geolocation_long: frmVal._geolocation_long,
                    _geolocation_lat: frmVal._geolocation_lat,
                    gallery: [
                      {
                        image: this.myImageUrl != "" ? this.api.generateRandomId(6) + ".jpg" : "",
                        name: this.myImageUrl
                      }
                    ],
                    description: frmVal.description,
                    phone: frmVal.phone,
                    website: frmVal.website,
                    email: frmVal.email,
                    facebook: frmVal.facebook,
                    twitter: frmVal.twitter,
                    youtube: frmVal.youtube,
                    instagram: frmVal.instagram,
                    whatsapp: frmVal.whatsapp,
                    skype: frmVal.skype,
                    _price_min: frmVal._price_min,
                    _price_max: frmVal._price_max,
                    _monday_opening_hour:this._listing_type == "57" && this.activeCard.indexOf('card-monday') >= 0  ?frmVal._monday_opening_hour : "",
                    _monday_closing_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-monday') >= 0 ? frmVal._monday_closing_hour : "",
                    _tuesday_opening_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-tuesday') >= 0 ? frmVal._tuesday_opening_hour : "",
                    _tuesday_closing_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-tuesday') >= 0 ? frmVal._tuesday_closing_hour : "",
                    _wednesday_opening_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-wednesday') >= 0 ? frmVal._wednesday_opening_hour : "",
                    _wednesday_closing_hour:this._listing_type == "57" && this.activeCard.indexOf('card-wednesday') >= 0 ? frmVal._wednesday_closing_hour : "",
                    _thursday_opening_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-thursday') >= 0 ? frmVal._thursday_opening_hour : "",
                    _thursday_closing_hour:this._listing_type == "57" && this.activeCard.indexOf('card-thursday') >= 0 ? frmVal._thursday_closing_hour : "",
                    _friday_opening_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-friday') >= 0 ? frmVal._friday_opening_hour : "",
                    _friday_closing_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-friday') >= 0  ? frmVal._friday_closing_hour : "",
                    _saturday_opening_hour: this._listing_type == "57" &&this.activeCard.indexOf('card-saturday') >= 0  ? frmVal._saturday_opening_hour : "",
                    _saturday_closing_hour:this._listing_type == "57" &&this.activeCard.indexOf('card-saturday') >= 0  ? frmVal._saturday_closing_hour : "",
                    _sunday_opening_hour: this._listing_type == "57" && this.activeCard.indexOf('card-sunday') >= 0  ? frmVal._sunday_opening_hour : "",
                    _sunday_closing_hour: this._listing_type == "57" && this.activeCard.indexOf('card-sunday') >= 0  ? frmVal._sunday_closing_hour : "",
                    _event_date: frmVal._event_date != "" ?  new DatePipe('en-US').transform(new Date(), 'MM/dd/yyyy h:mm a') : "",
                    _event_date_end: frmVal._event_date_end != "" ? new DatePipe('en-US').transform(new Date(), 'MM/dd/yyyy h:mm a') : "",
                }
                  
                this.api.addDirectoryListing(listingFrm).subscribe((resp: any) => {
                  this.api.hideLoader();   
                  if (resp.success) {
                    this.api.showToast(resp.message, 3000, "bottom");
                    this.router.navigateByUrl("/home/tabs/explore");
                  } else {
                    this.api.showToast(resp.message, 3000, "bottom");
                  }
                }, err => {
                  this.api.autoLogout(err, listingFrm);
                })
              }
            }
          ]
        });
    
        await alert.present();
      }else{
        this.selectedSegment = "basicInfo"
      }
    }
 
  }

  /* Accordian functions
  * @param activeBlock cardId to perform accordian view.
  */
 public openActiveBlock(activeBlock: any) {
     if (this.activeCard.length > 0) {
         // store index of value in array
         const indx = this.activeCard.indexOf(activeBlock);
         if (indx >= 0) {
             this.activeCard.splice(indx, 1);
         } else {
             this.activeCard.push(activeBlock);
         }
     } else {
         this.activeCard.push(activeBlock);
     }
 }

  convertTime(time) {
    return new DatePipe('en-US').transform(time, 'HH:mm')
  }
}
