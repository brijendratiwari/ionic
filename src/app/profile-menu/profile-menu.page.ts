import { PetcloudApiService } from "./../api/petcloud-api.service";
import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { User } from "../model/user";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import {
    NavController,
    Platform,
    ModalController,
} from "@ionic/angular";
import { filter, finalize } from "rxjs/operators";
import { NotificationSettingComponent } from "../notification-setting/notification-setting.component";
import { AuthenticationService } from "../services/authentication.service";
import { Subscription } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { ShadowLoginComponent } from "../shadow-login/shadow-login.component";
import { AppsFlyerService } from "../apps-flyer.service";
import { Events } from "../events";

@Component({
    selector: "app-profile-menu",
    templateUrl: "./profile-menu.page.html",
    styleUrls: ["./profile-menu.page.scss"],
})
export class ProfileMenuPage implements OnInit {
    public menuType: any = "";
    public profileStep: number;
    public completedProfileStep: number;
    public userData: User;
    isSaveLoginKeyPress = "";
    email = "";
    password = "";
    progressStepper: any;
    completedSteps: any;
    role = ""; // admin

    userImage: any = "";
    private myObserver = new Subscription();
    private events = null;
    private _routerProfileSub = new Subscription();
    public steps: any;
    public adminEmail = "";
    isFirstLoad: boolean = true;

    constructor(
        public PMEvents: Events,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public api: PetcloudApiService,
        private storage: Storage,
        public platform: Platform,
        protected navCtrl: NavController,
        public modalCtrl: ModalController,
        public navCntl: NavController,
        public auth: AuthenticationService,
        public appsFlyerAnalytics: AppsFlyerService,
    ) {

        this.adminEmail = localStorage.getItem("adminEmail");
        this.isFirstLoad = true;
        this._routerProfileSub.add(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe((event: any) => {

                    if (event.url == "/home/tabs/profile-menu") {
                        this.userImage = null;

                        this.storage.get("isLoggedInKeyPressed").then((isKeyPressed) => {
                            this.isSaveLoginKeyPress = isKeyPressed;
                            if (isKeyPressed) {
                                this.storage.get(PetcloudApiService.USER).then((res: User) => {
                                    this.email = res.email;
                                    this.storage.set("email", this.email);
                                });
                                this.storage.get("password").then((res) => {
                                    this.password = res;
                                });
                            }
                        });

                        this.storage.get(PetcloudApiService.USER).then((res: User) => {
                            this.userData = res;

                            if (res != null) {
                                Number(this.userData.user_type) === 1
                                    ? (this.profileStep = 5)
                                    : Number(this.userData.user_type) === 2
                                        ? (this.profileStep = 7)
                                        : Number(this.userData.user_type) === 3
                                            ? (this.profileStep = 8)
                                            : (this.profileStep = 0);
                            }
                        });
                    }
                })

        )


        this.myObserver.add(this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                if (event.url == "/home/tabs/profile-menu") {
                    this.storage.get(PetcloudApiService.USER).then((res: User) => {
                        if (res != null) {
                            if (event.url == "/home/tabs/profile-menu") {
                                this.getUserProfileBasicInfo(this.isFirstLoad);
                                this.getInfo();
                            }
                        } else {
                            this.api.SignInWindow();
                        }
                    });
                }
            }))
        this.backButtonEvent();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.userImage = null;
        this.myObserver.unsubscribe();;
        this.events = null;
        this._routerProfileSub.unsubscribe();
    }

    async switchToPreviousAccount() {

        const adminToken = localStorage.getItem("adminToken");

        const emailForm = {
            token: adminToken,
            userType: "admin"
        }

        this.api.showLoader();
        this.api.shadowLogin(emailForm).subscribe(
            async (res: ApiResponse) => {
                // hide loader in success
                this.api.hideLoader();
                if (res.success === true) {

                    // check token is received or user data received
                    if (res.user && res.token) {
                        this.auth.authState.next(true);

                        this.storage.set(PetcloudApiService.USERTOKEN, res.token);
                        localStorage.setItem("token", res.token);
                        localStorage.setItem("notificationToken", res.notificationToken);
                        localStorage.setItem("adminEmail", ""); // switch back to admin 

                        this.PMEvents.publish("user", res.user);

                        let background: any = res.user.BackgroundCheck;
                        let rightToWork: any = res.user.righttowork;
                        let animalCare: any = res.user.animalcare;

                        let is_verified = background.is_verified;
                        let is_workVerified = rightToWork.is_verified;
                        let is_animalcare = animalCare.is_verified;

                        is_verified == this.api.VERIFIED ? (res.user.isBackgroundChecked = true) : (res.user.isBackgroundChecked = false);
                        is_workVerified == this.api.VERIFIED ? (res.user.isRightToWorkChecked = true) : (res.user.isRightToWorkChecked = false);
                        is_animalcare == this.api.VERIFIED ? (res.user.isAnimalCareChecked = true) : (res.user.isAnimalCareChecked = false);

                        await this.storage.set(PetcloudApiService.USER, res.user).then(
                            (res) => {
                            },
                            (err) => {
                            }
                        );

                        let user_type = await res.user.user_type;

                        if (user_type == 3 || user_type == 2) {
                            localStorage.setItem("menuType", "sitter")
                            this.storage.set("menuType", "sitter").then((res) => {
                                this.PMEvents.publish("menuName", {menuType:"sitter", time: Date.now()})
                            })
                        } else if (user_type == 1) {
                            localStorage.setItem("menuType", "owner")
                            this.storage.set("menuType", "owner").then((res) => {

                            })
                        }

                        await this.api.addTokenInHeader();
                        localStorage.setItem("adminEmail", "");
                        this.adminEmail = "";
                        this.role = "admin"
                        this.getUserProfileBasicInfo(true); // Call API to update all value.

                    }
                } else {
                    this.api.showToast(res.error, '3000', "bottom");
                }
            },
            (err) => {
                // hide loader in error
                this.api.hideLoader();

            }
        );
    }

    getInfo() {
        this.storage.get(PetcloudApiService.USER).then((res: User) => {
            this.userData = res;
            this.userImage = res.imagename;
            this.role = res.role;
            this.storage.get("menuType").then((data: any) => {
                if (data == null || data === "") {
                    if (Number(this.userData.user_type) === 1) {
                        this.menuType = "owner";
                        this.storage.set("menuType", this.menuType);
                    } else if (Number(this.userData.user_type) === 2) {
                        this.menuType = "sitter";
                        this.storage.set("menuType", this.menuType);
                    } else {
                        this.menuType = "owner";
                        this.storage.set("menuType", "owner");
                    }
                } else {
                    this.menuType = data;
                }
            });
        });
    }



    gotoProfileMenu() {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
    }

    /**
     * Shadow Login to Switch User from other user
     * Only Admin has access for shadow Login
     */
    async shadowLogin() {
        const modal = await this.modalCtrl.create({
            component: ShadowLoginComponent,
            animated: true,
            componentProps: {
            },
        });
        modal.onDidDismiss().then((data: any) => {
            this.adminEmail = localStorage.getItem("adminEmail");
            this.getUserProfileBasicInfo(this.isFirstLoad)


        });
        return await modal.present();
    }

    /**
    * User can Logout from Application
    */
    public logoutUser() {

        this.api.showAlert(
            "Logout",
            "Are you sure to <b>Logout</b> from application?",
            [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "danger",
                    handler: (blah: any) => {
                        console.warn("user canceled logout");
                    },
                },
                {
                    text: "OK",
                    handler: async () => {
                        this.storage.set("menuType", null);
                        let viewPetJob = localStorage.getItem("viewPetJobs");
                        let trainingDone = localStorage.getItem(
                            PetcloudApiService.TRAININGDONE
                        );
                        let paymentCardData = "";


                        this.storage
                            .get(PetcloudApiService.STRIPECARD)
                            .then((cardData: any) => {
                                if (cardData != null && cardData !== "") {
                                    paymentCardData = cardData;
                                }
                            });

                        await this.storage
                            .remove(PetcloudApiService.USER)
                            .then(async (res: any) => {
                                this.api.showLoader();
                                this.api.logoutUser().subscribe(
                                    async (logRes: any) => {
                                        const analytics = {
                                            user_id:this.userData.id,
                                            logout_first_date:logRes.logout_first_date,
                                            logout_last_date:logRes.logout_last_date,
                                            app_version:this.appsFlyerAnalytics.getCurrentVersionCode(),
                                            app_type:this.appsFlyerAnalytics.platformName()
                                        }
                                        this.appsFlyerAnalytics.logoutAnalytics(analytics)
                                        
                                        this.api.hideLoader();
                                        this.clearStorage()
                                    },
                                    (err: any) => {
                                        this.clearStorage()
                                        this.api.autoLogout(err, "");
                                    }
                                );

                            });
                    },
                },
            ]
        );
    }

    async clearStorage() {
        await this.storage
            .remove(PetcloudApiService.USERTOKEN)
            .then(async (res: any) => {
                this.storage.set("menuType", null);
                let viewPetJob = localStorage.getItem("viewPetJobs");
                let trainingDone = localStorage.getItem(
                    PetcloudApiService.TRAININGDONE
                );
                let paymentCardData = "";

                this.storage
                    .get(PetcloudApiService.STRIPECARD)
                    .then((cardData: any) => {
                        if (cardData != null && cardData !== "") {
                            paymentCardData = cardData;
                        }
                    });

                localStorage.setItem("token", "")
                this.PMEvents.publish("user",null);
                this.PMEvents.publish("token",null);

                this.auth.authState.next(false);
                await localStorage.clear();
                this.storage.set("isLoggedInKeyPressed", false);

                viewPetJob == "yes"
                    ? localStorage.setItem("viewPetJobs", "yes")
                    : "";
                trainingDone == "yes"
                    ? localStorage.setItem(PetcloudApiService.TRAININGDONE, "yes")
                    : "";

                if (paymentCardData != null) {
                    this.storage.set(
                        PetcloudApiService.STRIPECARD,
                        paymentCardData
                    );
                }

                if (this.isSaveLoginKeyPress) {
                    await this.storage.set("email", this.email);
                    await this.storage.set("password", this.password);
                } else {
                    await this.storage.set("email", "");
                    await this.storage.set("password", "");
                }
                if (this.isSaveLoginKeyPress) {
                    this.navCtrl.navigateRoot("/login");
                } else {
                    this.navCtrl.navigateRoot("/get-started");
                }

            });

    }

    rspcaCMSPage() {
        this.router.navigate(["/cms"], {
            queryParams: { title: "RSPCA Safe Property Guide" },
        });
    }

    async notificationSettings() {
        const modal = await this.modalCtrl.create({
            component: NotificationSettingComponent,
            animated: true,
        });
        modal.onDidDismiss().then((data: any) => {
        });
        return await modal.present();
    }

    /**
    * switch menu for pet sitter and pet owner
    */
    public switchMenu(menuType) {

        menuType == "owner" ? (this.storage.set("menuType", "sitter"),
            this.PMEvents.publish("menuName", {menuType:"sitter", time: Date.now()}),
            this.menuType = "sitter") :
            (this.storage.set("menuType", "owner"),

                this.PMEvents.publish("menuName", { menuType:"owner", time:Date.now()}),
                this.menuType = "owner");

        this.api.showToast("Menu switched.", 2000, "bottom");
    }

    /**
    * Open wenpage using in app browser native plugin
    * @param url variable for pass URL
    */
    public openWebpage(url: string) {
        this.api.openExteralLinks(url)
    }

    // active hardware back button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            this.api.dismissModelorAlert();
            if (this.router.url == "/home/tabs/profile-menu") {
                this.navCtrl.navigateRoot("/home/tabs/sitter-listing")
            }
        });
    }

    public getUserProfileBasicInfo(showLoader) {
        if(showLoader) {
            this.api.showLoader();
        }
        this.api.getUserBasicProfile().pipe(finalize(() => {
            this.api.hideLoader();
            this.isFirstLoad = false;
        })).subscribe(async (res: ApiResponse) => {
            if (res.success) {

                this.userImage = res.user.imagename;
                this.userData = await res.user;
                this.storage.set(PetcloudApiService.USERBASICINFO, this.userData);
                this.progressStepper = await this.userData.progress;

                if (res.user.user_type == 1) {

                    this.steps = Array(3).fill(0).map((x, i) => i);

                    const stepperMenu = {
                        profile: this.progressStepper.profile,
                        email: this.progressStepper.email,
                        pet: this.progressStepper.pet,
                        // postedJobs: this.progressStepper.postedJobs,
                        // wallet: this.progressStepper.wallet,
                    }

                    const propertyValues = await Object.values(stepperMenu);
                    this.completedProfileStep = propertyValues.filter(x => x === 1).length;
                    this.steps = Object.keys(stepperMenu);

                } else {
                    this.steps = Array(5).fill(0).map((x, i) => i);

                    const stepperMenu = {
                        profile: this.progressStepper.profile,
                        email: this.progressStepper.email,
                        training: this.progressStepper.training,
                        payOut: this.progressStepper.payOut,
                        listing: this.progressStepper.listing,
                    }

                    const propertyValues = await Object.values(stepperMenu);
                    this.completedProfileStep = propertyValues.filter(x => x === 1).length;
                    this.steps = Object.keys(stepperMenu);


                }
                this.storage.set(PetcloudApiService.USER, this.userData);
                ;
            } else {
                this.api.showToast('Getting problem to fetch profile details', 2000, 'bottom');
            }
        }, (err: any) => {
            this.api.autoLogout(err, "")

        });
    }

    public numToArray(num: any) {
        return this.api.convertNumberToArray(num);
    }
}