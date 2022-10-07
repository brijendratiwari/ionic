import { Component, OnInit } from "@angular/core";
import { PetcloudApiService } from "../../../../src/app/api/petcloud-api.service";
import { finalize, filter } from "rxjs/operators";
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: "app-transactionscard",
  templateUrl: "./transactionscard.component.html",
  styleUrls: ["./transactionscard.component.scss"],
})
export class TransactionscardComponent implements OnInit {
  public walletData = {
    available_balance: "0",
    total_balance: "0",
  };
  
  private _routerSub = Subscription.EMPTY;
  
  slideOpts = {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
  };

  constructor(public api: PetcloudApiService,
    public router: Router) {
  
  }

  ionViewDidLeave(){
  }

  ngOnInit() {
    this.getWallet();
  }


  getWallet() {
    this.api.showLoader();
    this.api
      .getWallet()
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe((res: any) => {
        if (res.status) {
          const wallet = res.wallet;
          if (wallet || wallet != null) {
            this.walletData.available_balance = wallet.available_balance;
            this.walletData.total_balance = wallet.total_balance;
          }
        } else {
        }
      });
  }
}
