import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-referrals-history',
  templateUrl: './referrals-history.page.html',
  styleUrls: ['./referrals-history.page.scss'],
})

export class ReferralsHistoryPage implements OnInit {
  selectedSegment: any = "pending";
  referrals: any;
  isAPILoaded: boolean = false;
  constructor(public api:PetcloudApiService) { }

  ngOnInit() {
    this.isAPILoaded = false
    this.getRefferal();
  }

  getRefferal(){
    this.api.showLoader();
    this.api.getRefferalList().subscribe((data: any)=>{
      this.isAPILoaded = true
      this.api.hideLoader();
      if(data.success){
        this.referrals = data;
        console.log("Referal data", this.referrals);
      }
        
    },err=>{
      this.isAPILoaded = true
      this.api.autoLogout(err,"");
    })
  }

  resendInvite(email){
    const referal = {
      referred_email:email,
    }
    this.api.showLoader();
    this.api.inviteFriend(referal)
        .pipe(finalize(() => {
            this.api.hideLoader();
        }))
        .subscribe((res: any) => {
            if (res.success) {
                this.api.showToast('Referral Sent', 2000, 'bottom');
            } else {
                this.api.showToast('This email address has already been referred', 2000, 'bottom');
            }
        }, err => {
            this.api.autoLogout(err, referal);
        });
  }
 
}
