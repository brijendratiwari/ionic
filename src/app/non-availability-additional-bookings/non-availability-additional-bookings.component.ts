import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-non-availability-additional-bookings',
  templateUrl: './non-availability-additional-bookings.component.html',
  styleUrls: ['./non-availability-additional-bookings.component.scss'],
})
export class NonAvailabilityAdditionalBookingsComponent implements OnInit {

  message: "";
  constructor(public model: ModalController,
    public navParam: NavParams,
    public api: PetcloudApiService,
    public router:Router) { }

  ngOnInit() {
    this.message = this.navParam.get("message");
  }

  closeModal(){
    this.model.dismiss("");
  }

  inquireanyway(){
    this.model.dismiss("inquire")
    return false;
 
  }

  postjob(){
    this.closeModal();
    // this.router.navigateByUrl("/home/tabs/post-job")
    this.router.navigateByUrl("/home/tabs/view-job")
  }

  sitterListing(){
    this.closeModal();
    this.router.navigateByUrl("/home/tabs/sitter-listing")
  }

}
