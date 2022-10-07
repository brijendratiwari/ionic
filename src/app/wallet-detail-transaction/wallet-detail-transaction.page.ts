import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../../../src/app/api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ViewTransDetailComponent } from '../view-trans-detail/view-trans-detail.component';
import * as moment from 'moment';

@Component({
  selector: 'app-wallet-detail-transaction',
  templateUrl: './wallet-detail-transaction.page.html',
  styleUrls: ['./wallet-detail-transaction.page.scss'],
})
export class WalletDetailTransactionPage implements OnInit {

  walletTransactions: any[] = [];
  noTransaction: boolean = false;
  
  constructor(public api: PetcloudApiService,
    public modelCntl: ModalController) { }

  ngOnInit() {
    this.getWalletHistory();
  }

  needSupport(){
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
}

getWalletHistory(){
  this.api.getWalletTransaction().pipe(finalize(() => {
    this.api.hideLoader();
})).subscribe((res: any) => {
  
  if(res.status){
    
  if(res.transaction.length){
      this.noTransaction = false;
    res.transaction.forEach(async element => {
      element.created_at =  await moment(element.created_at).format("DD-MM-YYYY"); 

    });
    this.walletTransactions = res.transaction;
    }else{
      this.noTransaction = true;
    }
  
  }else{
    this.api.showToast(res.message,"3000","bottom");
  }
},err=>{
  this.api.autoLogout(err,"");
})
}

async transInfo(record) {
  const modal = await this.modelCntl.create({
    component: ViewTransDetailComponent,
    animated: true,
    componentProps: {
        record
    },
  });
  modal.onDidDismiss().then((data: any) => {});
  return await modal.present();
}

}
