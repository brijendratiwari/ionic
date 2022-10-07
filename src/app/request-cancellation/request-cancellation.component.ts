import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-request-cancellation',
  templateUrl: './request-cancellation.component.html',
  styleUrls: ['./request-cancellation.component.scss'],
})
export class RequestCancellationComponent implements OnInit {

  cancelReasonForm: FormGroup;
  isOtherReason: Boolean = false;
  messageDetails: any;
  constructor(protected router: Router,
    protected storage: Storage, public modal: ModalController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public api: PetcloudApiService, public navcntl: NavController) {

      this.messageDetails = navParams.get("messageDetails")

  }

  ngOnInit() {
    this.cancelReasonForm = this.formBuilder.group({
      reasonList: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      oreason: ['']
    });

  }

  location_onChange(loc) {
    if (loc.detail.value == "Other") {
      this.isOtherReason = true;
    } else {
      this.isOtherReason = false;
    }
  }

  public closeModal() {
    this.modal.dismiss();
  }

  submitReason() {
    const cancelFormParams: any = {
      bookingId: this.navParams.get('id'),
      reasonList: this.cancelReasonForm.value.reasonList,
      otherreason: this.cancelReasonForm.value.oreason,
      reason: this.cancelReasonForm.value.reason
    }
    this.api.showLoader()
    this.api.cancelBooking(cancelFormParams)
      .subscribe((res: any) => {
        console.log("Response", res);
        this.api.hideLoader();
        if (res.success) {
          this.api.showToast(res.message, 2000, 'bottom');
          this.modal.dismiss('', 'success');
        } else {
          let msg = res.message? res.message : res.error? res.error : 'Something went wrong try again.';
          this.api.showToast(msg, 2000, 'bottom');
        }
      }, (err: any) => {
        this.api.autoLogout(err,cancelFormParams)
        this.api.hideLoader();
        this.api.showToast('Try again', 2000, 'bottom');
      });
  }

}
