import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-vacination',
  templateUrl: './add-vacination.component.html',
  styleUrls: ['./add-vacination.component.scss'],
})
export class AddVacinationComponent implements OnInit {
  
  selectedPetId = "";
  public addVaction: FormGroup;
  startMinDate = "";
  myImageUrl: any;
  isImage: boolean = false;

  constructor(public navParams:NavParams,
    private formBuilder: FormBuilder,
    public api:PetcloudApiService,
    public actionSheetCtrl: ActionSheetController,
    public model:ModalController) {
    this.selectedPetId = navParams.get("petId");
   }

   ngOnInit() {

    this.startMinDate =  new Date(new Date()).toISOString();;

    this.addVaction = this.formBuilder.group({
      vactionationType: ['0', [Validators.required]],
      alertFrequeny: ['0',[Validators.required]],
      lastVactionation:[this.startMinDate, [Validators.required]],
      startTime: [ new DatePipe('en-US').transform(new Date(), 'HH:mm'), [Validators.required]],
    });   
  }

  closeModal(){
    this.model.dismiss();
  }

  

  addAlert(){  
    const vaccinationRecord = {
      PetAlerts:{
        petId:this.selectedPetId,
        alertType:this.addVaction.value.vactionationType,
        alertFrequency:this.addVaction.value.alertFrequeny,
        alertDate:  moment(this.addVaction.value.lastVactionation).format('YYYY-MM-DD'),
        startTime:this.addVaction.value.startTime
      }
    }

    this.api.showLoader();
      this.api.addVaccinationAlert(vaccinationRecord)
        .pipe(finalize(() => {
          this.api.hideLoader();
        })).subscribe((res: any) => {
          if (res.success) {
            this.api.showToast(res.message, '2000', 'bottom');
            this.closeModal();
          } else {
            this.api.showToast(res.message, '2000', 'bottom');
            this.closeModal();
          }
        }, (err: any) => {
          this.api.autoLogout(err,vaccinationRecord)
          this.api.hideLoader();
          this.closeModal();
         });
  }

}
