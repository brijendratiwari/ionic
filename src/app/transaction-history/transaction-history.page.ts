import {Component, OnInit} from '@angular/core';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {finalize} from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.page.html',
    styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {
    public selectedSegment = 'fromPetcloud';
    transactionHistory: any;
    paymentsHistory: any = [];
    expenseHistory: any = [];
    referral: any = [];

    constructor(public api: PetcloudApiService,
        public storage: Storage,public navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.getTransactionHistory();
    }

    /**
     * Get Transaction history list
     */
    public getTransactionHistory() {
        this.api.showLoader();
        this.api.transactionHistory()
            .pipe(finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                this.transactionHistory = res;
                this.paymentsHistory = this.transactionHistory.paymentsArray;
                this.expenseHistory = this.transactionHistory.expensesArray;
                this.referral = this.transactionHistory.referral
            }, (err: any) => {
                // this.api.showToast('no transaction found.', 2000, 'bottom');
                console.log('error from fetching transaction history', err);
                this.api.autoLogout(err,"")
            });
    }

}
