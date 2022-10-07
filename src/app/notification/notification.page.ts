import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { ModalController, NavController } from '@ionic/angular';
import { NotificationSettingComponent } from '../notification-setting/notification-setting.component';
import * as moment from 'moment';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
    
})
export class NotificationPage implements OnInit {

    public notificationsData: any = [];
    public unreadNotif = 0;
    public noNotification: boolean = false;
    //Pagiantion
    public offset: any = 0;
    showNotificationButton: boolean = false;
    showLoadingBubbles: boolean = false;
    totalNotifications: Number = 0;
    isFirstLoad: boolean = true;
    
    constructor(public api: PetcloudApiService,
        public modalCtrl: ModalController,
        private storage: Storage, private navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.offset = 0;
        this.unreadNotif = 0;
        this.isFirstLoad = true;
        this.getNotifications(this.offset);
    }


    public getNotifications(offset) {
        if(offset === 0 && this.isFirstLoad){
            this.api.showLoader();
            this.isFirstLoad = false;
        }
        this.api.getNotificationsList(offset)
            .pipe(
                finalize(() => {
                    this.api.hideLoader();
                }))
            .subscribe(async (res: any) => {
                this.showLoadingBubbles = false;
                this.totalNotifications = res.total;
                
                if (res.success === true && res.notifications.length > 0) {
                    this.showNotificationButton=true
                    this.noNotification = false;
                    var moreNotification: [] = res.notifications;
                    const temp: any = res.notifications;
                    if (moreNotification.length == 0) {
                    } else {
                        for (let i: any = temp.length - 1; i >= 0; i--) {

                            temp[i].createdate = await moment(temp[i].createdate).format("DD MMM YYYY hh:mm A");
                                if (temp[i].readTo == null) {
                                    this.unreadNotif++;
                                }
                                this.notificationsData.push(temp[i]);
                            }
                    }
                } else {
                    this.showNotificationButton=false;
                    if(this.notificationsData.length == 0){
                        this.noNotification = true;
                    }
                    
                  //  this.api.showToast('notifications not found', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.autoLogout(err,offset)
            });
    }

    loadData() {
        this.showLoadingBubbles = true;
        this.showNotificationButton = false;
        this.offset = parseInt(this.offset) + 6;
        this.getNotifications(this.offset) 
    }


    async showNotificaionDetails(notificaionDetails: any) {
        const modal = await this.modalCtrl.create({
            component: NotificationDetailComponent,
            animated: true,
            componentProps: {
                notifDetail: notificaionDetails
            }
        });
        if (notificaionDetails.readTo === null) {
            this.api.updateNotificaionReadStatus(notificaionDetails.id)
                .subscribe((res: any) => {
                    if (res.success) {
                        notificaionDetails.readTo = moment().format("YYYY-MM-DD  hh:mm:ss");
                        this.unreadNotif--;
                    }
                }, (err: any) => {
                    this.api.autoLogout(err,notificaionDetails.id)
                });
        }
        modal.onDidDismiss()
            .then((data: any) => {
             
            });
        return await modal.present();
    }

    public deleteMessage(messageId: any,index: any) {

        this.api.showAlert('Delete', 'are you sure to delete this notificaion?', [
            {
                text: 'cancel',
                role: 'cancel',
                cssClass: 'danger',
             
            },
            {
                text: 'Ok',
                handler: () => {
                    this.notificationsData.splice(index, 1);
                   
                    this.api.deleteMessage(messageId)
                        .subscribe((res: any) => {
                        }, err => {
                            this.api.autoLogout(err,messageId)
                        });
                }
            }
        ]);
    }

    async notificationSettings() {
        const modal = await this.modalCtrl.create({
            component: NotificationSettingComponent,
            animated: true,
        });
        modal.onDidDismiss()
            .then((data: any) => {
            });
        return await modal.present();
    }
}