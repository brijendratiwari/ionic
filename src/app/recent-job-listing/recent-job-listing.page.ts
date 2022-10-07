import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController } from '@ionic/angular';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage'


@Component({
  selector: 'app-recent-job-listing',
  templateUrl: './recent-job-listing.page.html',
  styleUrls: ['./recent-job-listing.page.scss'],
})
export class RecentJobListingPage implements OnInit {

  public recentSitterandJobPostingParams: any = { latitude: "", longitude: "", distance: "", offset: "" };
  //Response
  public recentJobs: any = []
  public moreDatarecentJobs: any = [];
  //Initilize variable count and offset to get more data from Server form loadData Method
  public count: any = 0;
  public offset: any = 6;

  constructor(protected storage: Storage,
    public router: Router, public api: PetcloudApiService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER)
      .then((res: User) => {
        this.recentSitterandJobPostingParams.latitude = res.latitude;
        this.recentSitterandJobPostingParams.longitude = res.longitude;
        this.recentSitterandJobPostingParams.distance = "60030";
        this.recentSitterandJobPostingParams.offset = "0";
        this.recentJobPost();
      });
  }

  ionViewDidEnter() {
    this.storage.get(PetcloudApiService.USER)
      .then((res: User) => {
        this.recentSitterandJobPostingParams.latitude = res.latitude;
        this.recentSitterandJobPostingParams.longitude = res.longitude;
        this.recentSitterandJobPostingParams.distance = '60030';

        this.recentJobPost();
      });
  }




  /**
  * Get Recent Near By Job Post
  * @param distance is static value passed as 30
  */
  public recentJobPost() {
    this.recentSitterandJobPostingParams.offset = '0';
    this.api.recentJobPosted(this.recentSitterandJobPostingParams).pipe(finalize(() => {
    })).subscribe((res: any) => {
      if (res.success) {
        this.recentJobs = res;
      }
    }, err => {
      if (err.status == 401) {
        this.storage.clear();
        this.api.showToast(this.api.logoutmsg, 2000, 'bottom');
        this.navCtrl.navigateRoot('/get-started');
    }else{
        this.api.showToast("Try Again",2000,"bottom")
    }
    })
  }

  /**
 * Load Data Pagination Method..
 */
  loadData(infiniteScroll) {
    this.count = parseInt(this.count) + 1;
    this.recentSitterandJobPostingParams.offset = this.count * this.offset;
    this.api.recentJobPosted(this.recentSitterandJobPostingParams).pipe(finalize(() => {
    })).subscribe((res: any) => {
      if (res.success) {
        this.moreDatarecentJobs = res;
        if (this.moreDatarecentJobs.length > 0) {
          this.recentJobs.push(this.moreDatarecentJobs);
        } else {
          infiniteScroll.target.complete();
        }
        this.count = this.count++;
      }
    }, err => {
      this.api.autoLogout(err,this.recentSitterandJobPostingParams)
      infiniteScroll.target.complete();
    })
  }
}
