import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-pet-report',
  templateUrl: './view-pet-report.component.html',
  styleUrls: ['./view-pet-report.component.scss'],
})
export class ViewPetReportComponent implements OnInit {

  reportData: any;
  constructor(public model:ModalController,
    public navParams: NavParams) {
  }

  ngOnInit() {
    this.reportData = this.navParams.get("petReport");
    console.log("pet report data", this.reportData);
  }

  closeModal(){
    this.model.dismiss();
  }

}
