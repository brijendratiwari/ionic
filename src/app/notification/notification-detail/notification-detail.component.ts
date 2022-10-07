import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {PetcloudApiService} from '../../api/petcloud-api.service';

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent implements OnInit {

    public notificaionDetail: any = '';

    constructor(public modal: ModalController, protected navParam: NavParams, public api: PetcloudApiService) {
    }

    ngOnInit() {
        this.notificaionDetail = this.navParam.get('notifDetail');
    }

    public closeModal() {
        this.modal.dismiss();
    }

}
