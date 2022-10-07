import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-app-maintainiance',
  templateUrl: './app-maintainiance.page.html',
  styleUrls: ['./app-maintainiance.page.scss'],
})
export class AppMaintainiancePage implements OnInit {

  constructor(public api: PetcloudApiService) { }

  ngOnInit() {
  }

  sendEmail(){
    this.api.sendEmailtoAccounts("service@petcloud.com.au",[""],"PetCloud is currently undergoing maintenance", "");
  }

}
