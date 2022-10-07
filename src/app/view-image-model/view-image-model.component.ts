import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-view-image-model',
  templateUrl: './view-image-model.component.html',
  styleUrls: ['./view-image-model.component.scss'],
})
export class ViewImageModelComponent implements OnInit {

  imageStr: string = "";
  constructor(public navParam: NavParams,public api:PetcloudApiService) { 
    this.imageStr = navParam.get("image")
  }

  ngOnInit() {}

  closeModal(){
    this.api.dismissModelorAlert();
  }

}
