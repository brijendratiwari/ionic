import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PetcloudApiService } from '../../../api/petcloud-api.service';

@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss'],
})
export class PolicyDetailComponent implements OnInit {

  public policyDetail:any[];
  constructor(public modal: ModalController, 
    public api: PetcloudApiService) { }

  ngOnInit() {
    this.getPolicyDetails()
  }

  closeModal(){
    this.modal.dismiss();
  }

  getPolicyDetails(){
    this.api.showLoader();
    this.api.policyDetails().subscribe((res: [])=>{
      this.api.hideLoader();
      this.policyDetail = res;
    },err=>{
      this.api.hideLoader();
    })
  }

}
