import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.scss'],
})
export class NotificationSettingComponent implements OnInit {
  // Initilize form
  public UsersForm: FormGroup;
  //User Data
  userData: any;
  modelContainer = false

  constructor(private formBuilder: FormBuilder, protected storage: Storage,
    public api: PetcloudApiService, public navcntl: NavController,
    public modal: ModalController) {
  
    }

  ngOnInit() {
    this.UsersForm = this.formBuilder.group({
      sendMeSMS:[],
      sendPush:[],
      sendMeEmail:[],
      new_booking_inquiry:[],
      new_unread_message:[],
      boking_inquiry_accept:[],
      job_application_accept:[],
      booking_declined:[],
      booking_cancel_request:[],
      booking_awaiting_payment:[],
      booking_confirmed:[],
      sitter_review_request:[],
      delay_delivery:[],
      disable_all_push:[],
    });

  }

  async getUserInfo() {
    try {
      this.userData = await this.storage.get(PetcloudApiService.USERBASICINFO);
      const notif: any =  this.userData.notifications;
      await this.UsersForm.patchValue({
          sendMeSMS: (Number(notif.sendMeSMS) === 1) ? true : false,
          sendPush: (Number(notif.sendPush) === 1) ? true : false,
          sendMeEmail:(Number(notif.sendMeEmail) === 1) ? true : false,
          new_booking_inquiry: (Number(notif.new_booking_inquiry) == 1) ? true : false,
          new_unread_message: (Number(notif.new_unread_message) == 1) ? true : false,
          boking_inquiry_accept: (Number(notif.boking_inquiry_accept) == 1) ? true : false,
          job_application_accept: (Number(notif.job_application_accept) == 1) ? true : false,
          booking_declined:(Number(notif.booking_declined) == 1) ? true : false,
          booking_cancel_request:(Number(notif.booking_cancel_request) == 1) ? true : false,
          booking_awaiting_payment:(Number(notif.booking_awaiting_payment) == 1) ? true : false,
          booking_confirmed: (Number(notif.booking_confirmed) == 1) ? true : false,
          sitter_review_request: (Number(notif.sitter_review_request) == 1) ? true : false,
          delay_delivery: (Number(notif.delay_delivery) == 1) ? true : false,
          disable_all_push:(Number(notif.disable_all_push) == 1) ? true : false,
      });
    } catch (err) {
      this.api.autoLogout(err,"")
    }
  }

  getUserInfoFromAPI() {
    this.api.getUserBasicProfile().pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: ApiResponse) => {
      if (res.success) {        
        this.userData = await res.user;
        await this.storage.set(PetcloudApiService.USERBASICINFO, this.userData);
        this.getUserInfo();
      }
    }, (err: any) => { });
  }

  ionViewWillEnter(){
    this.getUserInfo();
  }

  public closeModal() {
     this.modal.dismiss()
  }

  async updateNotificationSetting(settingName,value) {

    let notificaionFrm = await this.UsersForm.value;  
    if(notificaionFrm){
      notificaionFrm[settingName] = !value 
    }
    this.api.showLoader();
    this.api.userNotification(await notificaionFrm)
    .pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      if (res.success) {
        this.getUserInfoFromAPI();
      } else {
        this.getUserInfo();
        this.api.showToast("Notification Setting Failed to Update.", '2000', 'bottom')
      }
    }, (err: any) => {
      // console.log('error from update user setting', err);
     this.api.autoLogout(err,notificaionFrm)
    });
  }
     
}
 