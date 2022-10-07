import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Jobs } from '../../model/jobs';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {

     // Accept Job Params Data
     acceptJobParams: any = { id: "" };
     hideNoJobs: boolean = false;
 
 
     // store primary and secondary jobs details from local storage to compare ids and show jobs details.
     public services: any = {
         primaryServices: [],
         secondaryServices: []
     };
 
     // store jobs in this array
     public jobsListing: Array<Jobs> = [];
     public jobsWithService = [];
     public activeCard = [];
     applicants = [];
 
     //Pagiantion
     public offset: any = 0;
     moreJobData: any;
     recieveParams: any;
     jobId:any;
     constructor(protected storage: Storage, public api: PetcloudApiService,
         public navCntl: NavController, public navcntl: NavController,
         public route: ActivatedRoute,
         private router: Router, public platform: Platform) {
         this.backButtonEvent();
     }
 
 
     ngOnInit() {     
      this.recieveParams = this.route.params.subscribe(params => {
        this.jobId = params['jobId'];
      });
       this.getJobList();  
     }
 
     ionViewDidEnter() {
 
     }
 
 
     getJobList() {
         this.api.showLoader();
         this.api.getJobList(this.offset)
             .pipe(finalize(() => {
                 this.api.hideLoader();
             }))
             .subscribe(async (res: any) => {
                 if (res.success) {
                     if (res.jobs.length > 0) {
                         this.hideNoJobs = false;
 
                         res.jobs.forEach(async element => {
                             element.start_date = await moment(element.start_date ).format("DD MMM YYYY");
                             element.end_date = await moment(element.end_date).format("DD MMM YYYY");
                             element.created = await moment(element.created).format("DD MMM YYYY");
                         });
 
                         this.jobsListing = res.jobs;
                         this.openActiveBlock('card-'.concat(this.jobId));
                     } else if (res.jobs.length == 0) {
                         this.hideNoJobs = true;
                     }
                     console.log("this.jobsListing", this.jobsListing)
                 } else {
                     this.api.showToast("No Jobs Found", 2000, "bottom")
                 }
             }, err => {
                 console.log('error from update user setting', err);
                 this.api.autoLogout(err,this.offset)
             });
     }
 
 
     loadData(infiniteScroll) {
 
         this.offset = parseInt(this.offset) + 6;
 
         this.api.getJobList(this.offset)
             .pipe(finalize(() => { }))
             .subscribe((res: any) => {
                 if (res.success) {
                
                     this.moreJobData = res.jobs;
                     if (res.jobs.length > 0) {
                         var morJobList: [] = res.jobs;
                         if (morJobList.length == 0) {
                             infiniteScroll.target.complete();
                         } else {
                             for (let data of morJobList) {
                                 this.jobsListing.push(data);
 
                                 infiniteScroll.target.complete();
                             }
                         }
                     } else {
                         infiniteScroll.target.complete();
                     }
                     console.log("this.jobsListing", this.jobsListing)
                 }
             }, err => {
                 this.api.autoLogout(err,this.offset)
                 this.offset = this.offset++;
             });
     }
 
 
     /**
      * Accordian functions
      * @param activeBlock cardId to perform accordian view.
      */
     public openActiveBlock(activeBlock: any) {
         console.log("Active Block", activeBlock);
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
 
     /**
      * pause job
      * @param jobId pass job id to pause job
      */
     public pauseJob(jobId: any) {
         this.api.showAlert('Pause Job?', 'Are you sure to pause this job?', [
             {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'danger',
                 handler: (blah: any) => {
                     console.warn('user cancelled to paush this job');
                 }
             }, {
                 text: 'OK',
                 handler: () => {
                     // this.api.showLoader();
                     this.api.pauseJob(jobId)
                         .pipe(finalize(() => {
                             // this.api.hideLoader();
                         }))
                         .subscribe((res: any) => {
                             if (res.success) {
                                 this.api.showToast(res.message, 2000, 'bottom');
                                 this.ngOnInit();
                             } else {
                                 this.api.showToast(res.message, 2000, 'bottom');
                             }
                         }, (err: any) => {
                             this.api.autoLogout(err,jobId)
                         });
                 }
             }
         ]);
     }
 
 
     /**
     * Delete job
     * @param jobId pass job id to Delete job
     */
     public deleteJob(jobId: any) {
         this.api.showAlert('Delete Job?', 'Are you sure to Delete this job?', [
             {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'danger',
                 handler: (blah: any) => {
                     console.warn('user cancelled to paush this job');
                 }
             }, {
                 text: 'OK',
                 handler: () => {
                     // this.api.showLoader();
                     this.api.deleteJob(jobId)
                         .pipe(finalize(() => {
                             //    this.api.hideLoader();
                         }))
                         .subscribe((res: any) => {
                             if (res.success) {
                                 this.api.showToast(res.message, 2000, 'bottom');
                                 this.ngOnInit();
                             } else {
                                 this.api.showToast(res.message, 2000, 'bottom');
                             }
                         }, (err: any) => {
                             this.api.autoLogout(err,jobId)
                         });
                 }
             }
         ]);
     }
 
 
 
     /**
      * Resume Job
      * @param jobId Passing Job id to resume job
      */
     public resumeJob(jobId: any) {
         this.api.showAlert('Resume Job?', 'Are you sure to resume this job?', [
             {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'danger',
                 handler: (blah: any) => {
                     console.warn('user cancelled to resume this job');
                 }
             }, {
                 text: 'OK',
                 handler: () => {
                     // this.api.showLoader();
                     this.api.resumeJob(jobId)
                         .pipe(finalize(() => {
                             // this.api.hideLoader();
                         }))
                         .subscribe((res: any) => {
                             if (res.success) {
                                 this.api.showToast(res.message, 2000, 'bottom');
                                 this.ngOnInit();
                             } else {
                                 this.api.showToast(res.message, 2000, 'bottom');
                             }
                         }, (err: any) => {
                             this.api.autoLogout(err,jobId)
                         });
                 }
             }
         ]);
     }
 
     public getJobStatus(jobStatusCode: any): any {
         return PetcloudApiService.JOBSTATUS[jobStatusCode];
     }
 
     public getBookingStatus(code: any) {
         return this.api.getBookingStatusFullName(code);
     }
 
     public declineJob(id: any, applicantId: any) {
         this.api.showAlert('Unsuitable', '', [
             {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'secondary',
             }, {
                 text: 'OK',
                 handler: () => {
                     this.api.showLoader();
                     this.api.jobDecline(id, applicantId)
                         .pipe(finalize(() => {
                             this.api.hideLoader();
                         }))
                         .subscribe((res: any) => {
                             this.api.showToast(res.message, 2000, 'bottom');
                             this.ngOnInit();
                         }, (err: any) => {
                             this.api.autoLogout(err,({id,applicantId}))
                         });
                 }
             }
         ]);
     }
 
     // lets meet and greet
     public meetAndGreet(bookingId: any, job: any) {
         // first confirm that user want to meet and greet with minders or not.
         this.api.showAlert('Meet and Greet', 'are you sure to Meet and Greet?', [
             {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'secondary',
                
             }, {
                 text: 'OK',
                 handler: () => {
                   
                     // Lets Meet API Param Set Value
                     this.acceptJobParams.id = job.applicants[0].bookingID;
                     this.api.showLoader();
                     this.api.letsMeet(this.acceptJobParams)
                         .pipe(finalize(() => {
                             this.api.hideLoader();
                         })).subscribe((res: any) => {
                             if (res.success) {
                                 this.api.showToast("Success", '2000', 'bottom');
                                 this.navcntl.pop();
                             } else {
                                 this.api.showToast("Try Again", '2000', 'bottom')
                             }
                         }, (err: any) => {
                             this.api.autoLogout(err,this.acceptJobParams)
                         });
 
                 }
             }
         ]);
     }
 
     public orderByDateDesc(jobList: any) {
         const newArr: Array<any> = [];
         for (let i = jobList.length - 1; i >= 0; i--) {
             newArr.push(jobList[i]);
         }
         return newArr;
     }
 
     public convertNumberToArray(number: any) {
         return new Array(number);
     }
 
     // Hardware Back Button
     backButtonEvent() {
         this.platform.backButton.subscribe(async () => {
             // close modal
             // close side menua
             this.api.dismissModelorAlert();
             if (this.router.url === '/home/tabs/jobs') {
                 if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                     // this.platform.exitApp(); // Exit from app
                     navigator['app'].exitApp(); // work in ionic 4
                 } else {
                     this.api.showToast("Press agin to exit app", 2000, 'bottom');
                     this.api.lastTimeBackPress = new Date().getTime();
                 }
             }
         });
     }
 
     postJob() {
         this.router.navigateByUrl('/post-job');
     }

}
