import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController, IonApp } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-alter-booking-cost',
  templateUrl: './alter-booking-cost.component.html',
  styleUrls: ['./alter-booking-cost.component.scss'],
})
export class AlterBookingCostComponent implements OnInit {
  alterBookingFm: FormGroup;
  bookingId: any
  cost: any;
  public static isRefreshData: boolean;
  constructor(public modal: ModalController,
    protected navParam: NavParams, private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public api: PetcloudApiService, private storage: Storage, private navcntl: NavController) {
    this.bookingId = this.navParam.get('id');
    this.cost = this.navParam.get('cost');
   
  }

  ngOnInit() {
    AlterBookingCostComponent.isRefreshData = true;
    this.alterBookingFm = this.formBuilder.group({
      newCost: ['', [Validators.required]]
    });
  }


  closeModal() {
    this.modal.dismiss();
  }

  save() {

    this.api.showLoader();
      this.api.editCost(this.bookingId, this.alterBookingFm.value.newCost).pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe((res: any) => {
        console.log(res)
        if (res.success) {
          this.api.showToast(res.message, 2000, 'bottom')
          this.closeModal();
        } else {
          this.api.showToast(res.message, 2000, 'bottom')
        }
      }, (err) => {
      this.api.autoLogout(err,this.alterBookingFm.value.newCost);
      });
   
  }

}
