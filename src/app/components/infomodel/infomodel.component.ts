import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-infomodel',
  templateUrl: './infomodel.component.html',
  styleUrls: ['./infomodel.component.scss'],
})
export class InfomodelComponent implements OnInit {
  message:"";
  type: any;
  constructor(public modal: ModalController,public navParam: NavParams) {
    this.type = navParam.get('type');
   }

  ngOnInit() {}

  closeModal() {
    this.modal.dismiss()
  }

}
