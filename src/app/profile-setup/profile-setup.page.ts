import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {NavController, Platform} from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response';
import { Events } from '../events';

@Component({
    selector: 'app-profile-setup',
    templateUrl: './profile-setup.page.html',
    styleUrls: ['./profile-setup.page.scss'],
})
export class ProfileSetupPage implements OnInit {

    public stepList: any;
    public user_type: any;

    /**
     * page constructor for injection dependencies
     * @param PSEvent Profile setup event
     * @param storage application storage
     * @param navCtrl navigation controller
     * @param api api service
     */
    constructor(public PSEvent: Events, protected storage: Storage,
         public navCtrl: NavController,
         public plt: Platform, 
         public router: Router,
        public api: PetcloudApiService) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
       this.getSteps();
    }

    goToTrainingCourse(){
        if(this.stepList.training == 0){
            this.api.openExteralLinks("https://petcloud.com.au/petsittercourse")
        }
        
    }

    getSteps(){
        this.api.showLoader();
        this.api.getUserBasicProfile().pipe(finalize((
        ) => {
            this.api.hideLoader();
        })).subscribe(async (res: any) => {
        if (res.success) {
            this.stepList = await res.user.progress;
            this.user_type = await res.user.user_type;
            
            console.log("Step List", this.stepList);
        }},err=>{
            this.api.autoLogout(err,"");
        })
    }

    /**
     * get back on profile-menu page with updated data
     */
    public gotoProfileMenu() {
        this.navCtrl.navigateBack('/home/tabs/profile-menu').then(() => {
            this.PSEvent.publish('updateProfileStep', 'yes');
        });
    }

           // active hardware back button
   backButtonEvent() {
    this.plt.backButton.subscribe(async () => {

        this.api.dismissModelorAlert();
        if (this.router.url == "/profile-email-verify"
        || this.router.url == "/profile-setup"
        || this.router.url == "/profile-email-verify;backBtn=true"  ) {
            if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                navigator['app'].exitApp();
            } else {
                    this.api.showToast('Press again to exit app.',2000,"bottom");
                    this.api.lastTimeBackPress = new Date().getTime();
               
            }
        }
    });
}
}
