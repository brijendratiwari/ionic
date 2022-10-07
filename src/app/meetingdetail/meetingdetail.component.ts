import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Map, tileLayer, marker, icon } from 'leaflet';

@Component({
  selector: 'app-meetingdetail',
  templateUrl: './meetingdetail.component.html',
  styleUrls: ['./meetingdetail.component.scss'],
})
export class MeetingdetailComponent implements OnInit {
  

  map;
  location = {lat: null, lng: null};
  marker: any;
  eventName: any;
  public locationName: any = "";
  bookingId: "";
  locationData:any;
  isAPILoaded: boolean = false;

  public meetingDetails : any;
  constructor(public modal: ModalController,
    public api: PetcloudApiService,
  public navParams: NavParams,
    public router: Router) {
      this.bookingId = navParams.get("id");
     }

  ngOnInit() {
    this.getDetail();    
  }

  closeModal() {
      if(this.map){
        this.map._panes.markerPane.remove();
        this.map.remove();  
    }

    this.modal.dismiss();
  }

  getDetail(){
      this.api.showLoader();
      this.api.getBookingCalenderDetail(this.bookingId).subscribe((res:any)=>{
        this.api.hideLoader();  
      
          if(res.success){
              if(res.booking){
                  this.isAPILoaded = true        
                  this.meetingDetails = res.booking;
                  this.eventName = this.api.getBookingStatusFullName(res.booking.booking_status)
                  this.locationData = res.location;
                    
                    if(res.location == "petsittershouse"){
                      this.loadMap(res.booking.minder.latitude,res.booking.minder.longitude);
                    }else if(res.location == "petownershouse"){
                      this.loadMap(res.booking.owner.latitude,res.booking.owner.longitude);
                  }else{
                    this.loadMap(res.booking.minder.latitude,res.booking.minder.longitude);
                  }
              }

          }
      },err=>{
        this.isAPILoaded = false
        this.api.autoLogout(err,this.bookingId);
      })
  
  }

  /**
     * Load Google Map
     */
    loadMap(lat,long){

      this.api.showLoader();
      setTimeout(()=>{
        this.api.hideLoader();
        this.map = new Map('map').setView([lat, long], 12);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom:10,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        marker([lat, long]).
      addTo(this.map)
      },4000)
    
    }


    
  openGoogleMap(lat,lng,locationName){

    if(this.map){
      this.map._panes.markerPane.remove();
      this.map.remove();  
  }

    this.modal.dismiss();
    this.router.navigate(['/location-map', { lat:lat, lng:lng,locationName:locationName}]);
  }
}
