import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'app-booking-authorize',
  templateUrl: './booking-authorize.page.html',
  styleUrls: ['./booking-authorize.page.scss'],
})
export class BookingAuthorizePage implements OnInit {
   // Accept Job Params Data
   authCard: any = { id: "" };
   public messageId: any;
  constructor(public api: PetcloudApiService,public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,public navcntl: NavController) { 
       this.messageId = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
  }

  authorizeCard(){

     // Lets Meet API Param Set Value
     this.authCard.id = this.messageId;
     this.api.showLoader();
     this.api.bookingAuthorized(this.authCard)
         .pipe(finalize(() => {
             this.api.hideLoader();
         })).subscribe((res: any) => {
             console.log("Responsein Booking Authorize",res);
             if (res.success) {
                 this.api.showToast(res.message, '2000', 'bottom');
             } else {
                 this.api.showToast(res.message, '2000', 'bottom')
             }
         }, (err: any) => {
             console.log('error from update user setting', err);
            this.api.autoLogout(err,this.authCard);
         });

  }

}
