import { Component, NgZone, ViewChild } from '@angular/core';
import {
  Platform,
  NavController,
  AlertController,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from './api/petcloud-api.service';
import { Router, Event } from '@angular/router';
import { Observable, merge, of, fromEvent } from 'rxjs';
import { Market } from '@ionic-native/market/ngx';
import { finalize, mapTo, take } from 'rxjs/operators';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Badge } from '@ionic-native/badge/ngx';
// import { Nav } from "ionic-angular";
import { AuthenticationService } from './services/authentication.service';
import { User } from './model/user';
import { environment } from '../environments/environment';
import { JobDetailComponent } from './view-jobs/job-detail/job-detail.component';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { AppsFlyerService } from './apps-flyer.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Events } from './events';
import { RemoteChatScreenComponent } from './remote-chat-screen/remote-chat-screen.component';
import { ChatServiceService } from './chat-service.service';
import { AppVersion } from "@ionic-native/app-version/ngx";
import { Instabug, BugReporting } from "instabug-cordova";

declare let cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public isConnected: Observable<boolean>;
  public lastTimeBackPress = 0;
  public timePeriodToExit = 2000;
  public isVerified: boolean;
  public isEmailVerified: boolean = false;
  public isPhoneVerified: boolean = false;
  public isBackgroundcheck: boolean = false;
  public isWorkPermitted: boolean = false; // Work for Austrialia
  public isAmimalCare: boolean = false;
  public VERIFIED = 'Verified';
  userData: User;

  // @ViewChild(Nav) navChild: Nav;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    protected navCtrl: NavController,
    protected storage: Storage,
    public api: PetcloudApiService,
    public router: Router,
    public navCntl: NavController,
    public plt: Platform,
    public market: Market,
    public alertController: AlertController,
    public badge: Badge,
    public background: BackgroundMode,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public zone: NgZone,
    public usersEvent: Events,
    public authenticationService: AuthenticationService,
    private appsflyer: Appsflyer,
    private appsFlyerService: AppsFlyerService,
    public appVersion: AppVersion,
    public firebase: FirebaseX,
    private chatsService: ChatServiceService,
  ) {
    this.initializeApp();
    this.router.events.subscribe((event: Event) => {
      this.api.hideLoader();
    });
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      console.log('platform is ready!!!!');
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#fe4164');
      this.splashScreen.hide();

      //Called only on resume
      await this.getUserDetails();
      if (this.platform.is("cordova")) {
        await this.notificationSetup();
        await this.initAppsFlyer();
        await this.instaBug();
        this.idfaTracking();
      }

      await this.checkAppUpdates()

      this.badge.set(0);
      this.badge.clear();

      // Check Internet Connectivty
      this.isConnected = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );
      this.isConnected.subscribe((value) => {
        if (value) {
        } else {
          this.api.showToast('network offline', 3000, 'bottom');
          this.navCntl.navigateForward('/check-internet-connection');
        }
      });
    });
    this.navCntl.navigateForward('/home/tabs/sitter-listing');
  }

  async initAppsFlyer() {
    console.log('init appsflyer');
    let options = {
      devKey: 'FC28Y98UDtFpXghuqf8Fy3',
      appId: '1539909889',
      isDebug: true,
      onInstallConversionDataListener: true,
      onDeepLinkListener: true, // by default onDeepLinkListener is false!
      waitForATTUserAuthorization: 10,
    };
    await this.appsflyer.initSdk(options).then(
      (res: any) => {
        let conversionData = JSON.parse(res);
        if (conversionData.data.is_first_launch === true) {
          if (conversionData.data.af_status === 'Non-organic') {
            let media_source = conversionData.data.media_source;
            let campaign = conversionData.data.campaign;
            console.log(
              'This is a Non-Organic install. Media source: ' +
              media_source +
              ' Campaign: ' +
              campaign
            );
          } else if (conversionData.data.af_status === '≈≈') {
            console.log('Organic Install');
          }
        } else if (conversionData.data.is_first_launch === false) {
          // Not first launch
        }

        this.appsflyer.registerOnAppOpenAttribution().then(
          (res: any) => {
            let deeplinkData = JSON.parse(res);
            if (deeplinkData.type === 'onAppOpenAttribution') {
              var link = deeplinkData.data.link;
              console.log(link);
            } else {
              console.log('onAppOpenAttribution error');
            }
          },
          (err) => {
            console.log('Err in apps flyer', err);
          }
        );
      },
      (err) => {
        console.log('Err in apps flyer', err);
      }
    );
  }

  async instaBug() {

    Instabug.start(
      'ae03d4e68ddf78d119de941cd1ae0287',
      [BugReporting.invocationEvents.shake],
      function () {
        console.log('Instabug initialized.');
      },
      function (error) {
        console.log('Instabug could not be initialized - ' + error);
      }
    );
  }

  async getUserDetails() {
    console.log('get user details function');
    this.getUsers();
    this.usersEvent.subscribe('user', async (data: any) => {
      console.log('usersEvent data', data);
      if (data != null) {
        this.userData = await data;
        this.storage.set(await PetcloudApiService.USER, data);
      } else {
        this.getUsers();
      }
    });
  }

  async getUsers() {
    console.log('get user function!!!');
    await this.storage.get(PetcloudApiService.USER).then((userData: User) => {
      this.userData = userData;
      console.log(this.userData, "this.userData")
      if (this.userData.account) {
        this.isVerified = true;
      } else {
        this.isVerified = false;
      }
      if (!this.isVerified) {
        this.showConfirm();
      }
      const analytics = {
        user_id: userData?.id != null ? userData.id : '',
        user_status: userData?.id != null ? '' : '',
        app_open_first_date: '',
        app_open_last_date: '',
        app_open_count: '',
        session_number: '',
        session_id: '',
        app_version: this.appsFlyerService.getCurrentVersionCode(),
        app_type: this.appsFlyerService.platformName(),
      };
      // check app launch..
      this.appsFlyerService.appOpenedAnalytics(analytics);
    });
  }

  public async notificationSetup() {
    console.log("notification setup...")
    await this.platform.ready();
    // if (this.platform.is('ios')) {
    this.firebase.hasPermission().then(async (hasPermission) => {
      console.log("notification setup... hasPermission", hasPermission)
      if (!hasPermission) {
        this.firebase.grantPermission();
      }
    });
    // }
    this.firebase.onMessageReceived().subscribe(async (notifData: any) => {
      console.log("notification setup... notifData", notifData)
      this.platform.is("ios") ? this.notificationAlert(notifData.aps.alert.title, notifData.aps.alert.body, notifData) :
        this.notificationAlert(notifData.title, notifData.body, notifData)
    })
  }

  async notificationAlert(subHeader, message, data) {
    const alert = await this.alertController.create({
      subHeader,
      message,
      buttons: [
        {
          text: 'Okay',
          handler: async () => {
            this.notificationTapHandlers(data);
          },
        },
      ],
    });
    await alert.present();
  }

  async notificationTapHandlers(data) {
    if (data.type == 'booking') {
      try {
        if (!this.chatsService.activeChatInfo.isActive || this.chatsService.activeChatInfo.bookingId != data.id) {
          let userData: User = await this.storage.get(PetcloudApiService.USER);
          this.userData = userData;
          if (this.userData) {
            this.gotoMessageDetails(data.id);
          }
        }
      } catch (error) {

      }
      // this.router.navigate(['/message-detail'], {
      //   queryParams: { id: data.id },
      // });
    } else if (data.type == 'calender') {
      this.router.navigateByUrl('/availability');
    } else if (data.type == 'profile') {
      this.router.navigateByUrl('/basic-info');
    } else if (data.type == 'job') {
      this.jobDetailModel(data.id);
    } else if (data.type == 'url') {
      this.api.openExteralLinks(data.url);
    }
  }

  public async gotoMessageDetails(messageId) {
    this.api.showLoader();
    this.api.getMessageDetails(messageId)
      .pipe(take(1), finalize(() => {
        this.api.hideLoader();
      })).subscribe(async (res: any) => {
        if (res.success) {
          this.api.dismissModelorAlert();
          const messageDetails = await res.booking;
          if (messageDetails.messageView == 2 || messageDetails.messageView == '2') {
            let otherUserImage;
            let toName = messageDetails.minder.first_name == this.userData.first_name ? messageDetails.owner.first_name : messageDetails.minder.first_name;
            let sendPush = messageDetails.minder.first_name == this.userData.first_name ? messageDetails.owner.sendMePush : messageDetails.minder.sendMePush;
            otherUserImage = messageDetails.owner.imagename == this.userData.imagename ? messageDetails.minder.imagename : messageDetails.owner.imagename;

            const modal = await this.modalCtrl.create({
              component: RemoteChatScreenComponent,
              animated: true,
              componentProps: {
                id: messageDetails.id,
                minderId: messageDetails.minderId,
                ownerId: messageDetails.ownerid,
                userId: this.userData.id,
                currentUserImage: this.userData.imagename,
                otherUserImage,
                fromName: this.userData.first_name,
                toName,
                sendPush,
                dropOff: messageDetails.startDate,
                pickUp: messageDetails.endDate,
                serviceName: messageDetails.service.serviceType.serviceName,
                amount: messageDetails.service.total,
                bookingStatus: messageDetails.booking_status
              }
            });
            return await modal.present();
          } else {
            this.router.navigate(['/message-detail'], {
              queryParams: { id: messageId },
            });
          }

        } else {
          let msg = res.message ? res.message : res.error ? res.error : 'Something went wrong to get booking details.';
          this.api.showToast(msg, 2000, 'bottom');
        }

      }, (err: any) => {
      })

  }

  async jobDetailModel(jobId) {
    await this.getUsers();
    if (this.userData.id != undefined) {
      const modal = await this.modalCtrl.create({
        component: JobDetailComponent,
        animated: true,
        componentProps: {
          jobId: jobId,
          userId: this.userData.id,
          isModalClick: true,
        },
      });
      modal.onDidDismiss().then((data: any) => { });
      return await modal.present();
    }
  }

  idfaTracking() {
    const idfaPlugin = cordova.plugins.idfa;
    idfaPlugin.getInfo()
      .then(info => {
        console.log("idfaPlugin.getInfo 1", info)
        if (!info.trackingLimited) {
          return info.idfa || info.aaid;
        } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
          return idfaPlugin.requestPermission().then(result => {
            if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
              return idfaPlugin.getInfo().then(info => {
                console.log("idfaPlugin.getInfo", info)
                return info.idfa || info.aaid;
              });
            }
          });
        }
      })
      .then(idfaOrAaid => {
        if (idfaOrAaid) {
          console.log("idfaOrAaid", idfaOrAaid);
        }
      });
  }

  async checkAppUpdates() {

    this.api.checkAPPVersion().subscribe((res: any) => {

      console.log(res)

      this.appVersion.getVersionNumber()
        .then(async (version) => {

          console.log('checkAppUpdatesres', res, version)

          let alertButtons: any = [{
            text: "Upgrade",
            handler: () => {
              if (this.plt.is("ios")) {
                this.market.open("id1539909889");
              } else {
                this.market.open("com.petcloud.petcloud");
              }
              return false;
            },
          }];



          let serverVersion = res["ios_ver_name"].split('.').map(x => parseInt(x))
          if (this.plt.is("android")) {
            serverVersion = res["android_ver_name"].split('.').map(x => parseInt(x))
          }

          const appVersion = version.split('.').map(x => parseInt(x))
          console.log(serverVersion, appVersion)

          if (serverVersion[0] > appVersion[0] || serverVersion[1] > appVersion[1] || serverVersion[2] > appVersion[2]) {
            var alert = await this.alertController.create({
              header: "Exciting News!",
              cssClass: 'custom-alert-upgrade',
              message: "There’s a much better version of the PetCloud App",
              buttons: alertButtons,
              mode: "ios",
              backdropDismiss: false
            });
            alert.present();
          }
        })
        .catch((err) => {

        });

    })

  }
  showConfirm() {
    this.alertController.create({
      header: 'Update Payout Information',
      backdropDismiss: false,
      cssClass: 'verify-Btn',
      // subHeader: 'Beware lets confirm',
      message: 'Valid and up to date bank account information is required so you can be paid for your bookings.<br> For increased account security, you may be required to re-verify your identity.',
      buttons: [
        {
          text: 'Update my payout information',
          handler: () => {
            this.navCtrl.navigateForward(['/payout-prefrence'])
          }
        },
        {
          text: 'Find out more',
          handler: () => {
            // this.showConfirm();
            console.log('Let me think');
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
