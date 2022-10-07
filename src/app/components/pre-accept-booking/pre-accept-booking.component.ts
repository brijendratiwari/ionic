import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from 'src/app/api/petcloud-api.service';
import { AppsFlyerService } from 'src/app/apps-flyer.service';

@Component({
  selector: 'app-pre-accept-booking',
  templateUrl: './pre-accept-booking.component.html',
  styleUrls: ['./pre-accept-booking.component.scss'],
})
export class PreAcceptBookingComponent implements OnInit {
  @Input() minderName: string;
  @Input() ownerContact: string;
  @Input() socketDetails: any;
  shareContact: boolean;
  agreeTerms: boolean;
  
  constructor(public modal: ModalController,
    public api: PetcloudApiService,
    public appsFlyerService: AppsFlyerService,) { }

  ngOnInit() {}

  closeModal() {
    this.modal.dismiss()
  }

  bookingSubmit() {
    this.api.showLoader();
    this.api.acceptEnquiry(this.socketDetails.id)
        .pipe(finalize(() => {
          this.api.hideLoader();
        })).subscribe(async (res: any) => {
          if (res.success) {
              this.appsFlyerAnalytics("P", this.socketDetails.id,"","",this.socketDetails.minderId,this.socketDetails.ownerid);
              this.modal.dismiss();
          } else if(res.error){
              this.api.showToast(res.error, '2000', 'bottom');
              this.modal.dismiss()
          }
      }, (err: any) => {
          this.api.autoLogout(err, this.socketDetails.id);
      });
  }
  appsFlyerAnalytics(bookingStatus, bookingId, potentional_revenue,actual_revenue, minderId, owenerId) {
    const booking = {
        af_booking_status: bookingStatus,
        af_booking_id: bookingId,
        af_minder_id: minderId,
        af_owner_id: owenerId,
        af_potentional_revenue:potentional_revenue,
        af_actual_revenue:actual_revenue
    }
    this.appsFlyerService.bookingEvent(booking);
  }
}
