import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.page.html',
  styleUrls: ['./reminders-list.page.scss'],
})
export class RemindersListPage implements OnInit {

  remindersList: any = [];
  reminderTypes: any;
  isAPILoaded: boolean = false;
  public pageNo = 1;
  isPaignation: boolean = false;
  constructor(public api: PetcloudApiService,) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isAPILoaded = false;
    this.remindersList = [];
    this.reminders();
    this.getRemindersList("");
  }

  public notificationReminder(notificationCode: any) {
    let statusName = "";

    switch (notificationCode) {
      case "0": {
        statusName = "Send before a hour";
        break;
      }
      case "1": {
        statusName = "Send at a time";
        break;
      }
      case "2": {
        statusName = "Send one day before";
        break;
      }
    }
    return statusName;

  }

 

  public getReminderType(reminderType: any): any {
    return PetcloudApiService.remindersType(reminderType);
  }
  
  public reminderFrequency(reminderFreq: any) : any {
    return PetcloudApiService.reminderFrequency(reminderFreq);
  }


  public reminders() {
    fetch('assets/JSON/reminders.json')
      .then(res => res.json())
      .then((data) => {
        this.reminderTypes = data;
      });
  }

  getRemindersList(infiniteScroll) {

    if (this.pageNo == 1) {
      this.api.showLoader();
    }
    this.api.getReminderListAlert(this.pageNo).pipe(finalize(() => {
      if (this.pageNo == 1) {
        this.api.hideLoader();
      }
    })).subscribe((res: any) => {
      this.isAPILoaded = true;

      res.pages > this.pageNo ? this.isPaignation = true : this.isPaignation = false;

      if (res.success) {
        if (res.data.length) {
          if (infiniteScroll) {
            infiniteScroll.target.complete();
          }

          if (res.data.length) {

            res.data.forEach((async (data: any) => {
              this.remindersList.push(data)
            }))

          }
        } else {
          if (infiniteScroll) {
            infiniteScroll.target.complete();
          }
        }

      } else {
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      }
    }, err => {
      this.api.autoLogout(err, "");
    })
  }

  loadData(event) {
    this.pageNo = this.pageNo + 1;
    this.getRemindersList(event);
  }

}
