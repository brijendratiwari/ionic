import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sittergeneralavailability',
  templateUrl: './sittergeneralavailability.component.html',
  styleUrls: ['./sittergeneralavailability.component.scss'],
})
export class SittergeneralavailabilityComponent implements OnInit {

  constructor(public model: ModalController) { }

  ngOnInit() {}

  closeModal(){
    this.model.dismiss();
  }

}
