import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {RequestReferenceFormComponent} from '../request-reference-form/request-reference-form.component';

@Component({
    selector: 'app-reference',
    templateUrl: './reference.page.html',
    styleUrls: ['./reference.page.scss'],
})
export class ReferencePage implements OnInit {

    constructor(public modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    async openModal() {
        const modal = await this.modalCtrl.create({
            component: RequestReferenceFormComponent,
            animated: true
        });
        modal.onDidDismiss()
            .then((data: any) => {
                console.log('filter', data.data);

            });
        return await modal.present();
    }

}
