import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pet-taxi-agreement-model',
  templateUrl: './pet-taxi-agreement-model.component.html',
  styleUrls: ['./pet-taxi-agreement-model.component.scss'],
})
export class PetTaxiAgreementModelComponent implements OnInit {

  constructor(public model: ModalController) { }

  ngOnInit() {}

  closeModal(){
    this.model.dismiss();
  }

}
