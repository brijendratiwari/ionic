import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { ListingCategoryComponent } from "../listing-category/listing-category.component";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { DatePipe } from '@angular/common';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";


@Component({
  selector: "app-directory-listing",
  templateUrl: "./directory-listing.page.html",
  styleUrls: ["./directory-listing.page.scss"],
})

export class DirectoryListingPage implements OnInit {
  serviceName: any = "";
  serviceId: any = "";
  categories: any = [];
  pageNo : any = 1;
  noListingMessage: string = "";

  isPaginationShown: boolean = false;
  isAPILoaded: boolean = false;
  isFilterIconShown: boolean = false;
  @ViewChild("search") public searchElement: ElementRef;
  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
  };

  public data = {latitude: "", longitude:"",locationName:"",distance:"",selected_cate:"",start_date:"",end_date:""} ;
  public isFloatingMapButton: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
    public api: PetcloudApiService,
    public router: Router,
    public storage: Storage,
    public modalCtrl: ModalController,
    public androidPermission: AndroidPermissions,
    public geolocation: Geolocation,
    public datePipe: DatePipe,
    public locationAccuracy: LocationAccuracy) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
   
      const activateRouteData = JSON.parse(params.data);
      this.serviceName = await  activateRouteData.serviceName;
      this.serviceId = await activateRouteData.selected_cate;
      this.data.latitude = await activateRouteData.latitude;
      this.data.longitude = await activateRouteData.longitude;
      this.data.locationName = await activateRouteData.locationName;
      this.data.distance = await activateRouteData.distance;

      this.categories = [];
      this.isAPILoaded = false;
      this.getDirectoryListing("1",""); 

      console.log("service Name", this.serviceName);
      
      if(this.serviceName == "Pet Insurance"){
        this.noListingMessage = "Stay Tuned! We are working hard to bring you some great Pet Insurance Policies"
      }else if(this.serviceName == "Rewards and Offers"){
        this.noListingMessage  = " Stay Tuned! We are working hard to bring you only the best rewards and offers."
      }else if(this.serviceName == ""){
        this.noListingMessage = ""
      }else{
        this.noListingMessage = " We’re sorry but we do not have any listings matching your search, try to change you search settings"
      }
    });
  }

  getDirectoryListing(pageNo,infiniteScroll) {
    
        let params = {
            latitude: this.data.latitude,
            longitude:this.data.longitude,
            distance:this.data.distance,
            selected_cate:this.serviceId,
            limit:10,
            page:pageNo,
            start_date:this.data.start_date != "" ?new DatePipe('en-US').transform(this.data.start_date, 'MM/dd/y') : "",
            end_date:this.data.end_date != "" ?new DatePipe('en-US').transform(this.data.end_date, 'MM/dd/y') : ""
         }

   
      if(this.pageNo == 1){
        this.api.showLoader();
      }
      this.api.getDashboardListing(params).pipe(
          finalize(() => {
            if(this.pageNo == 1){
              this.api.hideLoader();
              this.isAPILoaded = true;
            }
  
            if(infiniteScroll){
              infiniteScroll.target.complete();
            }
          })
      ).subscribe(
          async (res: any) => {
            if (res.success) {
              const categoriesData : [] = await res.listing_data;
                if (res.listing_data === 0) {
                  this.isPaginationShown = false;
                } else if (res.listing_data.length > 0) {
                  this.isPaginationShown = true;
                  for (const data of categoriesData) {
                    this.categories.push(data);
                  }
                } else {
                    this.isPaginationShown = false;
                }

                if(this.categories.length){
                  this.isFilterIconShown = true;
                }else{
                  this.isFilterIconShown = false;
                }
                
            } else {
              this.isPaginationShown = false;
              this.api.showToast("No Data Available", 2000, "bottom");
            }
          },(err) => {
            this.isAPILoaded = true;
            this.isPaginationShown = false;
            this.api.autoLogout(err,params);
          },()=>{
            
            console.log("catch block")
          }
        );
    }catch(e){
      console.log("error",e)
    // }

    
  }
  goToGridView() {
    
   
      this.router.navigate(["/directory-listing-map"], {
        queryParams: { 
          selected_cate:this.serviceId,
          latitude:this.data.latitude,
          longitude:this.data.longitude,
          locationName:this.data.locationName,
          distance: this.data.distance
        },
        
      });
 
  }

  goBack(){
    this.router.navigateByUrl("/home/tabs/explore");
    // this.goToGridView();
  }

  public convertNumberToArray(number: any) {
    return new Array(number);
  }

  navigateDetails(data) {
    this.router.navigate(["/directory-listing-details"], {
      queryParams: {
        listingName: data.listing_title,
        listingId: data.listing_id,
        serviceName:this.serviceName,
        locationName:this.data.locationName
      },
    });
  }

  async showFilter() {
    const modal = await this.modalCtrl.create({
      component: ListingCategoryComponent,
      animated: true,
      componentProps: {
         data:this.data
      },
    });
    modal.onDidDismiss().then(async (data: any) => {
        console.log("showFilter data", data)
        if(data?.data && data.data != "no") {
          this.isAPILoaded = false;
          this.data = await data.data;

          this.serviceName = await  data.data.categoryName;
          this.serviceId = data.data.selected_cate
          this.categories = [];
          this.getDirectoryListing(1,"");
        }
    });
    return await modal.present();
  }
  async loadData(infiniteScroll){
    this.pageNo = await this.pageNo + 1;
    this.getDirectoryListing(this.pageNo,infiniteScroll);
  }
}
