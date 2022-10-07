import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-trans-detail',
  templateUrl: './view-trans-detail.component.html',
  styleUrls: ['./view-trans-detail.component.scss'],
})
export class ViewTransDetailComponent implements OnInit {

  transactionRecord: any
  disputeForm: FormGroup;
  isRaiseDispute: boolean = false;
  constructor(public model: ModalController,
    public formBuilder: FormBuilder,
    public api: PetcloudApiService,
    public navParam: NavParams) {

    this.transactionRecord = this.navParam.get("record");
  }

  ngOnInit() {
    this.disputeForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  showHideDispute(){
    this.isRaiseDispute == true ? this.isRaiseDispute = false : this.isRaiseDispute = true
  }

  raiseDispute() {
    const disputeForm = {
      Dispute: {
        title: this.disputeForm.value.title,
        description: this.disputeForm.value.description
      }
    }

    this.api.showLoader();
    this.api.raiseDispute(this.transactionRecord.id, disputeForm).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe((res: any) => {
      {
        console.log("Response", res);
        if (res.success) {
          this.api.showToast(res.message, 2000, 'bottom');
          this.closeModel();
        } else {
          this.api.showToast(res.error, 2000, 'bottom');
        }
      }
    }, (err: any) => {
      this.api.autoLogout(err,"");
  });
  }

  closeModel() {
    this.model.dismiss();
  }

}
