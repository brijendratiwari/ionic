import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { MenuController, NavController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

    constructor(protected router: Router, public sideMenu: MenuController, protected storage: Storage,
        public platform: Platform,
        public api: PetcloudApiService, public navCntl: NavController) {
        // disable side menu on welcome page
        this.sideMenu.enable(false);

        console.log(router.url);
    }
    ngOnInit() {
        this.backButtonEvent();
    }

    public slideOpt = {
        effect: 'flip',
        zoom: {
            toggle: false
        }
    };

    public async gotoSignupPage() {
     await  this.storage.set(PetcloudApiService.SKIPWELCOME, true);
        this.navCntl.navigateRoot('/get-started');
    }

    // Hardware Back Button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            this.api.dismissModelorAlert();
            if (this.router.url == "/get-started") {
                if (new Date().getTime() - this.api.lastTimeBackPress < this.api.timePeriodToExit) {
                    navigator['app'].exitApp(); // work in ionic 4
                } else {
                    if (this.router.url == "/get-started"  ) {
                        this.api.showToast("Press agin to exit app", 2000, 'bottom');
                        this.api.lastTimeBackPress = new Date().getTime();
                    }
                }
            }
        });
    }
}
