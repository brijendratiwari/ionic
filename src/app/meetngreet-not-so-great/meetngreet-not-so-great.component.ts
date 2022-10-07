import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { AppsFlyerService } from '../apps-flyer.service';
@Component({
  selector: 'app-meetngreet-not-so-great',
  templateUrl: './meetngreet-not-so-great.component.html',
  styleUrls: ['./meetngreet-not-so-great.component.scss'],
})
export class MeetngreetNotSoGreatComponent implements OnInit {

  notGreat: FormGroup;
  bookingId: any;
  messageDetails: any;
  constructor(public modal: ModalController,
    protected navParam: NavParams, private formBuilder: FormBuilder,
    public appsFlyerService: AppsFlyerService,
    public api: PetcloudApiService, private storage: Storage, private navcntl: NavController) {
  
    this.bookingId = navParam.get('id');
    this.messageDetails = navParam.get("messageDetails");

    console.log("messageDetails", this.messageDetails)
  }

  ngOnInit() {
    this.notGreat = this.formBuilder.group({
      cancelreason: ['', [Validators.required]]
    });
  }

  closeModal() {
    this.modal.dismiss();
  }

  submitReview() {

    const review: any = { cancelreason: this.notGreat.value.cancelreason };
    console.log("Review", review)
    this.appsFlyerService.bookingState({

    })
    this.api.showLoader();
    this.api.meetandgreetwentbad(this.bookingId, review)
      .subscribe((res: any) => {
        console.log("Response", res);
        this.api.hideLoader();
        if (res.success) {
          this.appsFlyerService.bookingEvent({
            af_booking_status: "D",
            af_booking_id: this.bookingId,
            af_minder_id: this.messageDetails.minderId,
            af_owner_id: this.messageDetails.ownerid,
            af_potentional_revenue:"",
            af_actual_revenue:""
          })
          this.api.showToast(res.message, 2000, 'bottom');
          this.modal.dismiss();
        } else {
          this.api.showToast(res.message, 2000, 'bottom');
          this.modal.dismiss();
        }
      }, (err: any) => {
        this.api.autoLogout(err,review);
        this.api.hideLoader();
        this.api.showToast('Try again', 2000, 'bottom');
      });
  }
}
