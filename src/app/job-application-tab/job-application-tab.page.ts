import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-job-application-tab',
  templateUrl: './job-application-tab.page.html',
  styleUrls: ['./job-application-tab.page.scss'],
})
export class JobApplicationTabPage implements OnInit {

  public selectedSegment: any;
    public jobApplications = {
        currentApplications: [],
        expiredApplications: []
    };
    public pagination = {
        page: 1,
        limit: 10
    }
    public activeCard = [];

    constructor(public api: PetcloudApiService,
        public router:Router,
        public storage: Storage,public navCntl:NavController) {

    }

    ngOnInit() {
        this.getJobApplications(this.pagination.page, "");
        this.selectedSegment = 'current';
    }

    ionViewDidEnter() {
    }

    ionViewWillLeave(){
        this.pagination.limit = 10;
    }
    
    ionViewDidLeave(){
        this.pagination.limit = 10
    }

    public getJobApplications(pageNo, pagination) {
        
        if(pageNo == 1){
            this.api.showLoader();
        }
        this.api.jobApplications(this.pagination)
            .pipe(finalize(() => {
                if(pageNo == 1){
                    this.api.hideLoader();
                }
            }))
            .subscribe((res: any) => {
                
                if(pagination){
                    pagination.target.complete();
                }

                if (res.applications.length) {

                    res.applications.forEach(async element => {

                        element.startDate =  await moment(element.startDate).format("DD MMM YYYY"); 
                        element.endDate =  await moment(element.endDate).format("DD MMM YYYY"); 
                        element.createdate =  await moment(element.createdate).format("DD MMM YYYY"); 
                        const elmIndex = this.jobApplications.currentApplications.findIndex((data)=> data.id == element.id);
                        if(elmIndex>-1) {
                            this.jobApplications.currentApplications[elmIndex] = element;
                        } else {
                            this.jobApplications.currentApplications.push(element);
                        }
                        // this.jobApplications.currentApplications.push(element);
                    });
                }
                if(res.expiredApplications.data.length) {
                    res.expiredApplications.data.forEach(async element => {
                        element.startDate =  await moment(element.startDate).format("DD MMM YYYY"); 
                        element.endDate =  await moment(element.endDate).format("DD MMM YYYY"); 
                        element.createdate =  await moment(element.createdate).format("DD MMM YYYY"); 
                        const elmIndex = this.jobApplications.expiredApplications.findIndex((data)=> data.id == element.id);
                        if(elmIndex>-1) {
                            this.jobApplications.expiredApplications[elmIndex] = element;
                        } else {
                            this.jobApplications.expiredApplications.push(element);
                        }
                        // this.jobApplications.expiredApplications.push(element);
                    });
                }
                // else {
                //     this.api.showToast('No application found Try again!', 2000, 'bottom');
                // }
            }, err => {
                this.api.autoLogout(err,this.pagination)
            });
    }

    /**
     * Accordian functions
     * @param activeBlock cardId to perform accordian view.
     */
    public openActiveBlock(activeBlock: any) {
        if (this.activeCard.length > 0) {
            // store index of value in array
            const indx = this.activeCard.indexOf(activeBlock);
            if (indx >= 0) {
                this.activeCard.splice(indx, 1);
            } else {
                this.activeCard.push(activeBlock);
            }
        } else {
            this.activeCard.push(activeBlock);
        }
    }

    public withdrawJob(jobId: any, id: any) {
        this.api.showAlert('Withdraw', 'Are you sure you want to withdraw this application?', [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'danger',
            }, {
                text: 'OK',
                handler: () => {
                    this.api.jobWithdraw(jobId, id)
                        .subscribe((res: any) => {
                            if (res.success) {
                                this.api.showToast('Job withdraw successful', 2000, 'bottom');
                                // refresh job list
                                this.jobApplications.currentApplications = [];
                                this.ionViewDidEnter();
                            } else {
                                this.api.showToast('Job not withdraw, Please try again!', 2000, 'bottom');
                            }
                        },err=>{
                            this.api.autoLogout(err,{jobId, id});
                        });
                }
            }
        ]);
    }

    loadData(event){
        this.pagination.page = this.pagination.page+1;
        this.getJobApplications(this.pagination.page, event);
    
    }
}
