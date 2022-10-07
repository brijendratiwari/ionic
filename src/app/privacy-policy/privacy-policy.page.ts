import {Component, OnInit} from '@angular/core';
import {PetcloudApiService} from './../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.page.html',
    styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

    public privacyHtml: string = '';

    constructor(public api: PetcloudApiService,
        public storage : Storage,
        public navCtrl : NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.getPrivacyPolicy();
    }

    public getPrivacyPolicy() {
        this.api.showLoader();
        this.api.getPrivacyPolicy().pipe(
            finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res.success) {
                    this.privacyHtml = res.privacy;
                    let findWord = /terms-of-service/gi;
                    this.privacyHtml = this.privacyHtml.replace(findWord, 'terms-and-condition');
                    findWord = /<a href="\/contact">/gi;
                    this.privacyHtml = this.privacyHtml.replace(findWord, '');
                } else {
                    this.api.showToast('something went wrong! Please try again.', 2000, 'bottom');
                }
                this.api.hideLoader();
            }, (err: any) => {
                this.api.hideLoader();
                this.api.autoLogout(err,"")
            });
    }

}
