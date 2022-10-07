import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.page.html',
  styleUrls: ['./bank-details.page.scss'],
})
export class BankDetailsPage implements OnInit {

  public bankDetails: any = ""
  constructor(public api: PetcloudApiService,
    public router: Router) { }

  ngOnInit() {
    this.getBankDetails();
  }

  needSupport() {
    this.api.openExteralLinks(this.api.FRESHDESK_WEB)
  }

  getBankDetails(){
    this.api.showLoader();
    this.api.bankDetail().pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      ).subscribe(
        (res: any) => {
          {
            if(res.status){
              this.bankDetails = res;
            }else{
              this.api.showToast(res.message,"3000","bottom")
            }
            
          }
        },
        (err: any) => {
          this.api.autoLogout(err,"");
        }
      );
  }

  paymentSend(){
    this.router.navigateByUrl("/addmoney")
  }
}
