import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-booking-success-component',
  templateUrl: './booking-success-component.component.html',
  styleUrls: ['./booking-success-component.component.scss'],
})
export class BookingSuccessComponentComponent implements OnInit {

  bookingId: any
  public apiService:any
  constructor(public model: ModalController,
    public alertController: AlertController,
    public navParam: NavParams,
    public injector:Injector,
    public router: Router,
    public api:PetcloudApiService) { 
      this.bookingId = this.navParam.get("bookingId");
      this.apiService =   this.injector.get(PetcloudApiService);
    }

  
  ngOnInit() {}


  closeModal(){
    this.model.dismiss() 
    this.router.navigate(["/message-detail"], {
      queryParams: { id: this.bookingId },
    });
  }

  goToMessageDetails(){
   this.closeModal();
  }


  async sendFollowUpEmail(){
    this.apiService.sendEmailtoAccounts("service@petcloud.com.au","","Follow up for booking.","")
  }
}