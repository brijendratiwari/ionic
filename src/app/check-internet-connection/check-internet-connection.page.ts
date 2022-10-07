import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController } from '@ionic/angular';
import {fromEvent, merge, Observable, of} from 'rxjs';
import {mapTo} from 'rxjs/operators';

@Component({
  selector: 'app-check-internet-connection',
  templateUrl: './check-internet-connection.page.html',
  styleUrls: ['./check-internet-connection.page.scss'],
})
export class CheckInternetConnectionPage implements OnInit {

  public isConnected: Observable<boolean>;

  constructor(public api: PetcloudApiService,
    public navCntl: NavController) { }

  ngOnInit() {
  }


}
