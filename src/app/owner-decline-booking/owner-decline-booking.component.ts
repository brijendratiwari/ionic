import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController, ModalController, NavParams, AlertController } from '@ionic/angular';
import { MeetandGreetComponentComponent } from '../meetand-greet-component/meetand-greet-component.component';
import { AppsFlyerService } from '../apps-flyer.service';

@Component({
  selector: 'app-owner-decline-booking',
  templateUrl: './owner-decline-booking.component.html',
  styleUrls: ['./owner-decline-booking.component.scss'],
})
export class OwnerDeclineBookingComponent implements OnInit {

  public declineForm: FormGroup;
  public isOtherReason: Boolean = false;
  public bookingId: any;
  public messageDetails: any;

  constructor(protected router: Router,
    protected storage: Storage, 
    public appsFlyerService: AppsFlyerService,
    public modal: ModalController,
    private _modal: ModalController,
  public navParams: NavParams, private formBuilder: FormBuilder,
    public alertController: AlertController,
    public api: PetcloudApiService, public navcntl: NavController) {
    this.bookingId = this.navParams.get('id');
    this.messageDetails = this.navParams.get("messageDetails");

  }

  ngOnInit() {
    this.declineForm = this.formBuilder.group({
      cancelreason: ['', [Validators.required]],
      cancelreasonother: ['']
    });
  }


  async meetandGreet() {
    const modal = await this._modal.create({
      component: MeetandGreetComponentComponent,
      animated: true,
      componentProps: {
          id: this.bookingId, // BookingID
      }
    });
    return await modal.present();
  }

  async meetPreviously() {
    const alert = await this.alertController.create({
      header: "We've Met Before",
      message: "Meet & Greets are a critical part of the process & are key to ensuring a worry free Pet Stay. Can you re-confirm you have met this Party in person before and a Meet & Greet is not needed.Note: We cannot cover bookings with insurance if parties have never met.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  cancelReason_onChange(event) {
    if (event.detail.value == "Other") {
      this.isOtherReason = true;
      if (this.declineForm.value.cancelreasonother != "") {
        this.declineForm.disabled;
      }

    } else {
      this.isOtherReason = false;
    }
  }

  submitDecline() {
    const declineFormParams: any = {
      cancelreason: this.declineForm.value.cancelreason,
      cancelreasonother: this.declineForm.value.cancelreasonother,
    }
    const bookingCancelFrm = {
      BookingCancelForm: {
          reason: this.declineForm.value.cancelreason,
          bookingId: this.bookingId,
          extendedReason: this.declineForm.value.cancelreasonother
      }
  };
    this.api.showLoader()
    // this.api.ownerdeclinebooking(this.bookingId, declineFormParams)
    this.api.bookingDecline(bookingCancelFrm, this.bookingId)
      .subscribe((res: any) => {
        this.api.hideLoader();
        if (res.success) {
          this.appsFlyerAnalytics("D", this.bookingId, "","", this.messageDetails.minderId, this.messageDetails.ownerid);
          this.api.showToast(res.message? res.message : 'Booking declined successfully', 2000, 'bottom');
          this.modal.dismiss('', 'success');
        } else {
          let msg = res.message? res.message : res.error? res.error : 'Something went wrong try again.';
          this.api.showToast(msg, 2000, 'bottom');
        }
      }, (err: any) => {
        this.api.autoLogout(err,declineFormParams)
        this.api.hideLoader();
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

  closeModal() {
    this.modal.dismiss();
  }
}
