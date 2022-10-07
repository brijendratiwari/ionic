import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { SocailshareComponent } from '../socailshare/socailshare.component';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-custom-map-popup',
  templateUrl: './custom-map-popup.component.html',
  styleUrls: ['./custom-map-popup.component.scss'],
})
export class CustomMapPopupComponent implements OnInit {

  listingData: any;
  isClicked: any ;
  cover_image: any;
  
  currentLatLong: {lat:null,lng:null};
  constructor(public navParams: NavParams,
    public api: PetcloudApiService,
    public modelCtrl: ModalController,
    public platform: Platform,) { }

  async ngOnInit() {
    this.listingData = await this.navParams.get("listingData");
    console.log("listing data", this.listingData)
    this.currentLatLong.lat = await this.navParams.get("currentLatLong").lat;
    this.currentLatLong.lng = await this.navParams.get("currentLatLong").lng;

    console.log("currentLatLong",this.currentLatLong);
    this.isClicked = await this.listingData.bookamrked;

    this.cover_image = this.listingData.cover_image[0].img;
  }

  closeModal(){
    this.modelCtrl.dismiss();
  }

  navigateToMap(){
    console.log("this.listingData", this.listingData);

    if(this.listingData.latitude != "" || this.listingData.latitude != null){

      var  coords = this.listingData.latitude + ',' + this.listingData.longitude;
      var q;
      if (this.platform.is("ios")) {
        q = 'maps://maps.apple.com/?q=' + coords;
      } else {
        q = 'geo:' + coords + '?q=' + coords;
      }
      q = q.replace(' ', '');
      window.location.href = q;

    }else{
      this.api.showToast("Address not provided","3000","bottom")
    }
  }

  bookmark(){
    this.isClicked == 0 ? this.isClicked = 1 : this.isClicked =  0;
    let params = {
      bookmark: this.isClicked,
      listing_id:this.listingData.id
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

  async share(){
    let shareMessage =
    "Check out this AWESOME " +
    this.listingData.title +
    " spot I found on PetCloud!" +
    this.listingData.url;

    console.log("share message", shareMessage);

  const modal = await this.modelCtrl.create({
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

}
