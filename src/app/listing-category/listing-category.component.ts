import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Storage } from "@ionic/storage";
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

@Component({
  selector: "app-listing-category",
  templateUrl: "./listing-category.component.html",
  styleUrls: ["./listing-category.component.scss"],
})
export class ListingCategoryComponent implements OnInit {

  services: any;
  currentDate: any;
  priceText: string = "Enable Price Filter"
  compareWith : any;
  isFilterData:boolean = false;
  isApplyButtonEnabled: boolean = false;
  isDatePickerShown:boolean = false
  isAPILoaded: boolean = false;

  public selectedFilter: any = {  
    latitude:"",
    longitude:"",
    distance:10,
    selected_cate:'',
    limit:10,
    page:1,
    price:100,
    start_date:"",
    end_date:"",
    categoryName:"",
    locationName:""
  };

  isPriceShown: boolean = true;
  isDistanceShown: boolean = true;
  categories: any;

  // Setting Min Date and Min Max Time
  public startMinDate = "";
  public minEdDate: any;
  public minToDate: any;
  public frmDate: any;
  public toDate: any;
  
  @ViewChild("search") public searchElement: ElementRef;

  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
  };

  isDisabled: boolean = true;
  previousPage: "";
  constructor(public model: ModalController,
    public storage: Storage,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public navParam: NavParams,
    public locationAccuracy: LocationAccuracy,
    public androidPermission:AndroidPermissions,
    public api: PetcloudApiService) {
    this.currentDate = new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toISOString();
  }

  ngOnInit() {
    this.isAPILoaded = false;

     const data = this.navParam.get("data");
     this.selectedFilter.latitude = data.latitude;
     this.selectedFilter.longitude = data.longitude;
     this.selectedFilter.locationName = data.locationName;

     this.selectedFilter.serviceName = data.categoryName;
     this.selectedFilter.distance = data.distance? data.distance : 10;
     this.selectedFilter.selected_cate = data.selected_cate;

    this.getServiceCategories();
  }

  ionViewWillEnter(){
      // get tomorrow date.
      const today = new Date();
      const todayDate = new Date(today.setDate(today.getDate())).toISOString();
      this.startMinDate = todayDate;
    
  }

  closeModal(value) {

    if(value == "no"){
      this.model.dismiss(value);
    } else {
      const filterDataModel = {
        latitude:this.selectedFilter.latitude,
        longitude:this.selectedFilter.longitude,
        distance:this.selectedFilter.distance,
        selected_cate:this.selectedFilter?.selected_cate?.term_id,
        limit:10,
        page:1,
        price:this.selectedFilter.price,
        start_date:this.selectedFilter.start_date,
        end_date:this.selectedFilter.minEdDate,
        categoryName:this.selectedFilter.categoryName,
        locationName:this.selectedFilter.locationName,
      }
      this.model.dismiss(filterDataModel)
    }
  }

  handleAddressChange(events) {
    this.selectedFilter.latitude = events.geometry.location.lat();
    this.selectedFilter.longitude = events.geometry.location.lng();
    this.selectedFilter.locationName  = events.address_components[0].long_name + " , " + events.address_components[2].long_name;
  }

  selectedCategory(event){
  
    this.selectedFilter.selected_cate = event.detail.value;
    this.selectedFilter.categoryName = event.detail.value.name;
    this.isApplyButtonEnabled = true;

    if(event.detail.value.isDateFilerShow){
      this.isDatePickerShown = true
    }else{
      this.isDatePickerShown = false
      this.selectedFilter.start_date = "";
      this.selectedFilter.minEdDate = ""
    }
  }

 

 

  getServiceCategories() {
     
    let param = {
        latitude:  this.selectedFilter.latitude ,
        longitude: this.selectedFilter.longitude,
        distance:25,
        selected_cate:"",
        limit:10,
        page:1,
    }
     
     this.api.showLoader();
     this.api.getCategoryFilter(param).pipe(finalize(() => {
         this.api.hideLoader();
     })).subscribe(async (res: any) => {

      if(res.success){
        this.isAPILoaded = true;
        if(res.categories.length){
          this.categories = await res.categories;
          if(this.categories.length){
            // this.selectedFilter.selected_cate = this.categories[0];
            // this.selectedFilter.categoryName = this.categories[0].name;
            this.compareWith = this.compareWithFn;
          }
        }
    }   
    this.api.hideLoader();
    },err=>{
       this.api.autoLogout(err,param);
     })
  }

  
  compareWithFn = (o1, o2) => {
     return o1 && o2 ? o1 === o2 : o1 === o2;
  };


  enablePriceFilter(event){
    event.detail.checked == true ? this.isDisabled = false : this.isDisabled = true;
    event.detail.checked == true ? this.isPriceShown= true : this.isPriceShown= false
  }

  enableDistanceFilter(event){
    event.detail.checked == true ? this.isDistanceShown = true : this.isDistanceShown = false;
  }

   //Set End Date and Clearing Form Values of To Date
   public fromDate(event) {  
      this.minEdDate = this.selectedFilter.start_date;
     this.selectedFilter.minEdDate =  this.selectedFilter.start_date;
  }

  public endDateChange(event) {
 
  }
}
