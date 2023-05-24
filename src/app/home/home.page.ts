import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../app/api/petcloud-api.service';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { Events } from '../events';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    @ViewChild('myTabs', { read: true }) tabs: IonTabs;
    userType: any = "";
    private routeSubscrible = new Subscription();
    private events = null;
    showPushNotification = false

    public tabSelected = {
        isPostJobSelected: false,
        isViewJobSelected: false,
        isSitterScreen: false,
        isMessageSelected: false,
        isProfileSelected: false,
        // isMessageListSelected:false,
        isMessageNullTab: false,
        isExploreScreen: false,
    }

    constructor(public sideMenu: MenuController,
        protected PMEvents: Events,
        private platform: Platform,
        private diagnostic: Diagnostic,
        private nativeSettings: OpenNativeSettings,
        protected storage: Storage,
        private router: Router,
        public api: PetcloudApiService) {

        this.routeSubscrible.add(
            PMEvents.subscribe("menuName", (data) => {
                console.log("menuName data", data);
                if (data == true) {
                    this.storage.get("menuType").then((res) => {
                        if (res != null) {
                            this.userType = res;
                        }
                    });
                } else {
                    this.storage.get("menuType").then((res) => {
                        if (res != null) {
                            this.userType = res;
                        } else {
                        }
                    });
                }
            })
        )

        this.storage.get("menuType").then((res) => {
            if (res != null) {
                this.userType = res;
            } else {
                // this.router.navigateByUrl('/home/tabs/expore')
            }
        });

        this.platform.ready().then(async (data) => {
            this.checkNotification();
        });
        this.platform.resume.subscribe(async () => {
            this.checkNotification();
        });

    }

    checkNotification(): void {
        if (this.platform.is("cordova")) {
            this.diagnostic.isRemoteNotificationsEnabled().then(enabled => {
                if (!enabled) {
                    this.showPushNotification = true
                } else {
                    this.showPushNotification = false
                }
            }).catch (error => { console.log() });
        }
    }

    openSettings() {
        this.nativeSettings
            .open('application_details')
            .then( res => {
                console.log(res);
            })
            .catch( err => {
                console.log(err);
            })
    }

ngOnInit(): void {
    // this.PMEvents.publish("stripe", Date.now())
}

ngOnDestroy() {
    this.events = null;
    this.routeSubscrible.unsubscribe();
}

    public sliderOpts = {
    slidesPerView: 2.5
};

getSelectedTab(event) {
    this.PMEvents.publish("stripe", Date.now())
    this.api.isHomeTabsChanged = true
    event.tab == "get-started" ? this.tabSelected.isMessageNullTab = true : this.tabSelected.isMessageNullTab = false
    event.tab == "explore" ? this.tabSelected.isExploreScreen = true : this.tabSelected.isExploreScreen = false;
    event.tab == "jobs-tab" ? this.tabSelected.isViewJobSelected = true : this.tabSelected.isViewJobSelected = false
    event.tab == "sitter-listing" ? this.tabSelected.isSitterScreen = true : this.tabSelected.isSitterScreen = false
    event.tab == "messages" ? this.tabSelected.isMessageSelected = true : this.tabSelected.isMessageSelected = false
    event.tab == "profile-menu" ? this.tabSelected.isProfileSelected = true : this.tabSelected.isProfileSelected = false
}
}
