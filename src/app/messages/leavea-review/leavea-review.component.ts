import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppsFlyerService } from '../../../../src/app/apps-flyer.service';

@Component({
  selector: 'app-leavea-review',
  templateUrl: './leavea-review.component.html',
  styleUrls: ['./leavea-review.component.scss'],
})
export class LeaveaReviewComponent implements OnInit {

  /** manage form in page */
  Review: FormGroup;
  messageDetails:any;
  reviewForm: any = {
    id: '',
    rate: '',
    message: ''
  }
  constructor(public modal: ModalController,
    protected navParam: NavParams, private formBuilder: FormBuilder,
    public router:Router,
    public appsFlyerAnalytics: AppsFlyerService,
    public api: PetcloudApiService, private storage: Storage, private navcntl: NavController) {
    this.reviewForm.id = navParam.get('id');
    this.messageDetails = navParam.get("messageDetails")
    console.log("BOOKINGID", this.reviewForm.id);
  }

  ngOnInit() {
    this.Review = this.formBuilder.group({
      rate: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
    * close self modal
    */
  public closeModal() {
    this.modal.dismiss();
  }

  //Submit Leave Review API
  public submitLeaveReview() {
    this.reviewForm.rate = this.Review.value.rate;
    this.reviewForm.message = this.Review.value.message;

    this.api.showLoader();
    this.api.createReview(this.reviewForm)
      .pipe(finalize(() => {
        this.api.hideLoader();
      }))
      .subscribe((res: any) => {
        if (res.success) {

          this.appsFlyerAnalytics.bookingEvent({
            af_booking_status: "C",
            af_booking_id: this.reviewForm.id,
            af_minder_id: this.messageDetails.minderId,
            af_owner_id: this.messageDetails.ownerid,
            af_potentional_revenue:"",
            af_actual_revenue:""
          }) 
                                
          
          this.api.showToast(res.message,2000,"bottom"); 
          this.modal.dismiss();
        }
      }, (err: any) => {
        this.api.autoLogout(err,this.reviewForm);
      });
   }

   tc(){
     this.modal.dismiss();
     this.navcntl.navigateForward('/terms-and-condition');
   }

   onRateChange(event){
     
   }

}
