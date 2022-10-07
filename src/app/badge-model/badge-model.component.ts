import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-badge-model',
  templateUrl: './badge-model.component.html',
  styleUrls: ['./badge-model.component.scss'],
})
export class BadgeModelComponent implements OnInit {
  imageName:""
  badgeName:""
  constructor(public navParam: NavParams,
    public model: ModalController) {

    this.imageName = this.navParam.get("imageName");
    this.badgeName = this.navParam.get("badgeName");
   }

   closeModal(){
     this.model.dismiss();
   }

  ngOnInit() {}

}
