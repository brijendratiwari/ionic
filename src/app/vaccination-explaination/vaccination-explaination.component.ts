import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-vaccination-explaination',
  templateUrl: './vaccination-explaination.component.html',
  styleUrls: ['./vaccination-explaination.component.scss'],
})
export class VaccinationExplainationComponent implements OnInit {

  constructor(public api:PetcloudApiService,public model:ModalController) { }

  ngOnInit() {}

  closeModal(){
    this.model.dismiss();
  }

}
