import {Component, OnInit} from '@angular/core';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {finalize} from 'rxjs/operators';
import {Storage} from '@ionic/storage'
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
    selector: 'app-job-applications',
    templateUrl: './job-applications.page.html',
    styleUrls: ['./job-applications.page.scss'],
})

export class JobApplicationsPage implements OnInit {
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
        public storage: Storage,public navCntl:NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.getJobApplications('1', "");

        this.selectedSegment = 'current';
    }

    ionViewWillLeave(){
        this.pagination.limit = 10;
        this.pagination.page = 1
        this.api.hideLoader();
    }
    
    ionViewDidLeave(){
        this.pagination.limit = 10;
        this.pagination.page = 1
        // this.api.hideLoader();
    }

    public getJobApplications(pageNo, pagination) {
        
        if(pageNo == 1){
            this.api.showLoader();
        }
        this.api.jobApplications(this.pagination)
            .pipe(finalize(() => {
                // if(pageNo == 1){
                //     this.api.hideLoader();
                // }
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
                        
                        this.jobApplications.currentApplications.push(element)
                    });
                }
                if(res.expiredApplications.data.length){
                    res.expiredApplications.data.forEach(async element => {

                        element.startDate =  await moment(element.startDate).format("DD MMM YYYY"); 
                        element.endDate =  await moment(element.endDate).format("DD MMM YYYY"); 
                        element.createdate =  await moment(element.createdate).format("DD MMM YYYY"); 
                        
                        this.jobApplications.expiredApplications.push(element);
                    });
                    console.log('applications',   this.jobApplications);
                }
            
                 if(pageNo == 1){
                    this.api.hideLoader();
                }

            }, err => {

                 if(pageNo == 1){
                    this.api.hideLoader();
                }

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
        console.log(this.activeCard);
    }

    public withdrawJob(jobId: any, id: any) {
        this.api.showAlert('Withdraw', 'Are you sure you want to withdraw this application?', [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'danger',
                handler: (blah: any) => {
                    console.warn('user cancelled to withdraw this job');
                }
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
        this.pagination.page = this.pagination.page + 1;
        this.getJobApplications(this.pagination.page, event)
    }
}
