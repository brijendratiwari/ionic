import {Component, OnInit} from '@angular/core';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {finalize} from 'rxjs/operators';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-terms-and-condition',
    templateUrl: './terms-and-condition.page.html',
    styleUrls: ['./terms-and-condition.page.scss'],
})
export class TermsAndConditionPage implements OnInit {

    public termsHtml: string = '';

    constructor(public api: PetcloudApiService,
                public storage: Storage, public navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.api.hideLoader();
        this.getTermsAndCondition();
    }

    /**
     * Fetch Terms and condition.
     */
    public getTermsAndCondition() {
        this.api.showLoader();
        this.api.getTermsAndCondition().pipe(
            finalize(() => {
                this.api.hideLoader();
            })
        )
            .subscribe((res: any) => {
                if (res.success) {
                    console.log("response", res.conditions)
                    this.termsHtml = res.conditions;
                } else {
                    this.api.showToast('something went wrong! Please try again.', 2000, 'bottom');
                }

            }, (err: any) => {
                this.api.autoLogout(err,"")
            });
    }
}
