import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PetcloudApiService } from '../../../../src/app/api/petcloud-api.service';
import { finalize, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.scss'],
})
export class WalletTransactionComponent implements OnInit {
  private _routerSub = Subscription.EMPTY;
  public walletData = {
    available_balance:"0",
    reward_point_balance:"0",
    total_balance:"0",
    withdrawable_balance:"0",
    unavailable_balance:"0",
  }

  isCreditShown: boolean = false;
  constructor(public router:Router,
    public api: PetcloudApiService) { 
    router.url == "/wallet" ? this.isCreditShown = true : this.isCreditShown = false;

    this._routerSub = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      console.log("event", event.url);
      this.getWallet();
      this._routerSub.unsubscribe();
    });
  }

  slideOpts = {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true
    };

  ngOnInit() {

  }

  goToAddMoney(){
      this.router.navigateByUrl('/addmoney');
  }

  getWallet(){
    this.api.showLoader();
    this.api.getWallet().pipe(finalize(() => {
      this.api.hideLoader();
  })).subscribe((res: any) => {
    if(res.status){
      const wallet = res.wallet;
      if (wallet || wallet != null) {
        this.api.availableBalance = wallet.available_balance;
        this.walletData = {
          available_balance: wallet.available_balance,
          reward_point_balance:wallet.reward_point_balance,
          total_balance:wallet.total_balance,
          withdrawable_balance:wallet.withdrawable_balance,
          unavailable_balance:wallet.unavailable_balance,
        }
        console.log("Wallet Data", this.walletData);
      }
    }else{
      console.log("Wallet Data", this.walletData);
    }
  })
}
}
