import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {
  title : any;
  message: any
  constructor(public modal: ModalController,
    public api: PetcloudApiService,
    public navParam: NavParams) { 

    this.title = this.navParam.get("title");
    this.message = this.navParam.get("message");

   
  }
  ngOnInit() {}

  closeModal(){
    this.modal.dismiss();
  }




  


}
