import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController, Platform, PopoverController, IonContent, AlertController, } from "@ionic/angular";
import { ChatServiceService } from "../chat-service.service";
import { Chat } from "../model/chat";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "angularfire2/firestore";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { CameraService } from "../camera-service.service";
import { Camera } from "@ionic-native/camera/ngx";
import { PetReportComponentComponent } from "../pet-report-component/pet-report-component.component";
import { ChatscreenFilesharingPopupComponent } from "../chatscreen-filesharing-popup/chatscreen-filesharing-popup.component";
import { ViewPetReportComponent } from "../view-pet-report/view-pet-report.component";
import { Router } from "@angular/router";
import { AnalyticsService } from "../analytics.service";
import { MeetandGreetComponentComponent } from "../meetand-greet-component/meetand-greet-component.component";
import { WalletBookingCheckoutComponent } from "../wallet-booking-checkout/wallet-booking-checkout.component";
import { AppsFlyerService } from "../apps-flyer.service";
import { Socket } from 'ngx-socket-io';
import * as moment from "moment";
import { PreAcceptBookingComponent } from "../components/pre-accept-booking/pre-accept-booking.component";
import { User } from "../model/user";
import { finalize } from "rxjs/operators";
import { LeaveaReviewComponent } from "../messages/leavea-review/leavea-review.component";
import { MessageDetailPage } from "../message-detail/message-detail.page";
const timestampformat = "YYYY-MM-DD HH:mm:ss";
const timestampformatto = "DD/MM/YYYY HH:mm:ss";

@Component({
  selector: "app-remote-chat-screen",
  templateUrl: "./remote-chat-screen.component.html",
  styleUrls: ["./remote-chat-screen.component.scss"]
})
export class RemoteChatScreenComponent implements OnInit {
  bookingId: any;
  userId: any;
  minderId: any;
  ownerId: any;
  currentUserImage: any;
  otherUserImage: any;
  chats: Array<Chat>;
  public checkTyping: boolean = false;
  public petReport: {};
  shouldScroll: boolean = true;
  userFlags: any;
  isOnline: any;
  isTyping: boolean = false;
  lastSeen: any = "";
  fcmToken: any = "";
  fcmToToken: any = "";
  sendPushToken: any = "";
  fromName: any = "";
  toName: any = "";
  dropOff: any = "";
  pickUp: any = "";
  amount: any = "";
  serviceName: any = ""
  bookingStatus: any = "";

  isButtonVisible: boolean = true;
  isMeetGreetButtonVisible: boolean = true;

  public userChatModel: any = {
    userId: "",
    isTyping: false,
  };

  userModelUpdatedFlags: any;
  type: any;
  public chatLength: any = "";
  public chatMessage: any = "";
  sendPush: any;
  docIdUpdate: any;
  @ViewChild('content') content: ElementRef;
  authCard: any = { id: "" };
  public user: User;
  isFirstCall: boolean = true;
  socketArray: any;
  isOpening: boolean = false;

  constructor(
    navParams: NavParams,
    private chatsService: ChatServiceService,
    private afs: AngularFireStorage,
    private afStore: AngularFirestore,
    public api: PetcloudApiService,
    private storage: AngularFireStorage,
    public ionicStorage: Storage,
    private platform: Platform,
    public backgroundMode: BackgroundMode,
    public modal: ModalController,
    public CameraAPI: CameraService,
    public camera: Camera,
    public modalCtrl: ModalController,
    public router: Router,
    public analytics: AnalyticsService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public appsFlyerService: AppsFlyerService,
    private socket: Socket,
    protected lstorage: Storage,
  ) {

    this.bookingId = navParams.get("id");
    this.userId = navParams.get("userId");
    this.minderId = navParams.get("minderId");
    this.ownerId = navParams.get("ownerId");
    this.currentUserImage = navParams.get("currentUserImage");
    this.otherUserImage = navParams.get("otherUserImage");
    this.fromName = navParams.get("fromName");
    this.toName = navParams.get("toName");
    this.sendPush = navParams.get("sendPush");
    this.type = this.userId == this.ownerId ? "owner" : "minder";
    this.fcmToken = localStorage.getItem("fcmToken");
    this.dropOff = navParams.get("dropOff");
    this.pickUp = navParams.get("pickUp");
    this.amount = navParams.get("amount");
    this.serviceName = navParams.get("serviceName");
    this.bookingStatus = navParams.get("bookingStatus");
    this.bookingStatus == "D" || this.bookingStatus == "CAN" || this.bookingStatus == "E" ? this.isButtonVisible = false : this.isButtonVisible = true;
    if(this.platform.is("cordova")){
      this.analytics.logEvent(PetcloudApiService.chatscreen, { userId: this.userId });
    }
  }

  ngOnInit() {
    this.lstorage.get(PetcloudApiService.USER).then(
      (user: User) => {
        this.user = user;
      },
      (err) => {
        
      }
    );
    this.api.showLoader();
    this.chatsService.activeChatInfo = {
      isActive: true,
      bookingId: this.bookingId
    }
    this.isFirstCall = true;
    setTimeout(() => {      
      this.connectSocket();
      setTimeout(() => {
        this.socket.disconnect();
        this.connectSocket();
      }, 1000);
    }, 500);
  }

  async connectSocket() {
    let repToken: any = await this.api.getIoToken().toPromise();
    if(repToken && repToken.status && repToken.token) {
      this.socket.ioSocket.io.opts.query = { token: repToken.token };
      this.socket.connect();
      setTimeout(() => {
        this.inItMessage();
      }, 300);
    }
  }

  ionViewWillLeave() {
    this.removeAnchorEventListner();
    this.socket.disconnect();
    this.chatsService.activeChatInfo = {
      isActive: false,
      bookingId: null
    }
  }

  inItMessage() {
    this.socketArray = {
      id: this.bookingId,
      userId: this.userId,
      ownerId: this.ownerId,
      minderId: this.minderId
    }

    this.socket.emit('userData', this.socketArray);
    this.socket.emit('initial-messages', this.socketArray);

    this.socket.on("kicked", (data) => {
      this.api.showToast(data.msg, 2000, "bottom");
    });

    this.socket.on("new-message", (data) => {
      if(data.id != this.socketArray.id){
				return false;
			}
      this.socket.emit('initial-messages', this.socketArray);
    });

    this.socket.on("new-image", (data) => {
      if(data.id != this.socketArray.id){
				return false;
			}
      this.socket.emit('initial-messages', this.socketArray);
    });
    this.socket.on('typing' , function (data) {
      console.log("typing data", data);
    });
    
    this.socket.on('initial-message' , (data) => {
      let initial = 0;
      if(!this.isFirstCall){        
        this.api.hideLoader();
      }
      this.isFirstCall = false;
			if(data.id != this.socketArray.id){
				return false;
			}
      if(initial === 0 && data.msg) {
        var arr =JSON.parse(data.msg);
        this.chats = arr;
        if(this.chats?.length>0) {
          setTimeout(() => {
            this.removeAnchorEventListner();
            this.generateAnchorEventListner();
          }, 500);
        }
      }
    })
  }

  scrollToBottom() {
    if (this.chatLength) {
      let chatContainer = document.querySelector('.chat-list');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.removeAnchorEventListner();
    this.socket.disconnect();
  }

  public async fileSharingPopOver(ev) {
    const popover = await this.popoverController.create({
      component: ChatscreenFilesharingPopupComponent,
      componentProps: {
        userType: this.type
      },
      translucent: false,
      event: ev,
      showBackdrop: false,
    });
    popover.onDidDismiss().then(async (data: any) => {
      if (data.data != undefined) {
        if (data.data == "Camera") {
          this.pickImage(1)
        } else if (data.data == "Photo Gallery") {
          this.pickImage(0)
        } else {
          this.petReportModel();
        }
      }
    });
    return await popover.present();
  }

  async pickImage(params) {
    params == 1 ? params = this.camera.PictureSourceType.CAMERA : params = this.camera.PictureSourceType.PHOTOLIBRARY;

    if(params == this.camera.PictureSourceType.PHOTOLIBRARY) {
      const status = await this.CameraAPI.checkPhotoLibraryPermission();
      if(!status) {
        return;
      }
    }

    this.CameraAPI.getPicture(params).then((base64String: any) => {
      // this.upload("data:image/jpeg;base64," + base64String);
      let base64Data = "data:image/jpeg;base64," + base64String
      const filename = "Image" + "b" + this.bookingId + "Id" + (Math.floor(1000 + Math.random() * 900000) + 1);
      var data = {
        id: this.bookingId,
        userId: this.userId,
        ownerId: this.ownerId,
        minderId: this.minderId,
        user_type: '',
        booking_user: '',
        systemGenerated: '',
        action: 'insert',
        name: filename,
        type: 'image/jpeg',
        buf: base64Data
      };
      this.socket.emit('uploadImage',data);

    }, err => { })
  }

  getLocalTime(utcTime) {
    return moment(moment.utc(moment.utc(utcTime,timestampformat)).toDate()).local().format(timestampformatto);
  }

  inArray(chat) {
    const userArray = chat.threadIdent.split(',');
    return userArray && userArray.findIndex((d) => d== this.userId)>-1
  }

  closeModal() {
    this.modal.dismiss();
  }

  generateAnchorEventListner() {
    const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    if(anchorElements?.length>0) {
      anchorElements.forEach((elem)=>{
        if(this.platform.is('cordova') && elem?.target!= "_system") {
          elem.setAttribute('target', '_system');
        }
        elem.addEventListener('click', (e) => { 
          e.preventDefault(); 
          this.validateAndRedirect(elem.href)
        });
      })
    }
  }

  removeAnchorEventListner() {
    const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    if(anchorElements?.length>0) {
      anchorElements.forEach((elem)=>{        
        elem.removeEventListener('click', (e) => { 
          e.preventDefault(); 
          this.validateAndRedirect(elem.href)
        });
      })
    }
  }

  validateAndRedirect(herf) {
    if(herf) {
      const isValid = this.api.validURL(herf);
      if(isValid && !this.isOpening && this.platform.is('cordova')) {
        this.isOpening = true;
        this.api.openExteralLinks(herf);
      }
    }
    this.isOpening = false;
  }

  isMessageonChange(event) {

    if (event.value.length == 0) {
      let userModel = {
        isTyping: false
      }
			this.socket.emit('typing', '');
    } if (event.value.length == 1) {
      var user = this.userId ;
			this.socket.emit('typing', user + ' is typing...');
    }
  }

  sendMessage() {

    const to = this.userId == this.minderId ? this.ownerId : this.minderId;
    if (this.chatMessage != "" || this.petReport != undefined) {

      if (this.petReport != "" || this.chatMessage.replace(/^\s+/, "").replace(/\s+$/, "")) {
        var config = {
          id: this.bookingId,
          message: this.petReport? "Pet report sent" : this.chatMessage,
          user_id: this.userId,
          ownerId: this.ownerId,
          minderId: this.minderId,
          user_type: this.type,
          booking_user: '',
          systemGenerated: '',
          action: 'insert',
        };

        if(this.petReport) {
          config['pet_report_card'] = this.petReport;
        }

        this.socket.emit('send-message' , config);
        this.pushToken(this.chatMessage, "");
        this.chatMessage = "";
      }
    }
  }

  async petReportModel() {
    const modal = await this.modalCtrl.create({
      component: PetReportComponentComponent,
      animated: true,
      componentProps: {
      },
    });
    modal.onDidDismiss().then(async (data: any) => {
      if (data.data != undefined) {
        this.petReport = await data.data;
        if (this.petReport) {

        }
        this.chatMessage = this.fromName + " has shared a Pet Visit Report"
        this.sendMessage()

      }
    });
    return await modal.present();
  }

  pushToken(message, imagePath) {
    if (this.sendPush == 1) {
      let msg;
      message == "" ? (msg = "You have recieved an image") : (msg = message);
      let body = {
        to: this.sendPushToken,
        priority: "high",
        notification: {
          title: "You have message from " + this.fromName,
          body: msg,
          badge: 1,
          sound: "default",
          icon: '../../assets/img/matchlink.png',
          iconColor: "#00AABB",
          image: imagePath
        },
      };

      if (body.to != null) {
        this.api.sendPush(body).subscribe(
          (response) => {
            console.log(response);
          },
          (err) => {
            console.log('err', err);
          }
        );
      }
    } else {
    }
  }

  async viewPetReport(petReport) {
    const modal = await this.modalCtrl.create({
      component: ViewPetReportComponent,
      animated: true,
      componentProps: {
        reportData: JSON.parse(petReport)
      },
    });
    modal.onDidDismiss().then(async (data: any) => {
      if (data.data != undefined) {
        this.petReport = await data.data;
        if (this.petReport) {

        }
        this.chatMessage = "File For Pet Report"
        this.sendMessage()
      }
    });
    return await modal.present();
  }

  async preApprove() {
    const modal = await this.modalCtrl.create({
      component: PreAcceptBookingComponent,
      showBackdrop: true,
      componentProps: {
        minderName: this.toName,
        ownerContact: this.user.mobile? this.user.mobile : this.user.phone,
        socketDetails: this.socketArray
      },
      cssClass: 'pre-accept-component'
    });
    await modal.present();
    modal.onDidDismiss()
      .then((data: any) => {
        this.socket.emit('initial-messages', this.socketArray);           
      });
  }

  public meetAndGreet() {
    // first confirm that user want to meet and greet with minders or not.
    this.api.showAlert('Meet and Greet', 'are you sure to Meet and Greet?', [
        {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
           
        }, {
            text: 'OK',
            handler: () => {
                this.api.showLoader();
                this.api.letsMeet({ id: this.bookingId })
                    .pipe(finalize(() => {
                        this.api.hideLoader();
                    })).subscribe((res: any) => {
                        if (res.success) {
                          this.socket.emit('initial-messages', this.socketArray);
                          this.api.showToast("Success", '2000', 'bottom');
                        } else {
                            this.api.showToast("Try Again", '2000', 'bottom')
                        }
                    }, (err: any) => {
                        this.api.autoLogout(err,  { id: this.bookingId })
                    });

            }
        }
    ]);
  }

  async leaveReview() {
    const modal = await this.modalCtrl.create({
        component: LeaveaReviewComponent,
        animated: true,
        componentProps: {
            id: this.bookingId, // BookingID
            messageDetails: this.socketArray
        }

    });
    modal.onDidDismiss()
        .then((data: any) => {
          this.socket.emit('initial-messages', this.socketArray);           
        });
    return await modal.present();
  }

  async chargeOwner() {

    const alert = await this.alertController.create({
        header: 'CONFIRM BOOKING FOR PET OWNER',
        subHeader: 'By clicking on OK, you indicate that you have met this Pet Owner' +
            'and happy to confirm this booking for. ' + this.toName
            + ' We will now charge the owner and you will be paid after booking end date (They will now pay for 2 weeks if this is a recurring booking). Please be proactive in communicating with your client on this booking.',
        buttons: [
            {
                text: 'Close',
                role: 'cancel',
                cssClass: 'secondary',

            }, {
                text: 'Ok',
                handler: (data) => {

                    this.api.showLoader();
                    this.api.chargeownerbooking(this.bookingId)
                        .subscribe((res: any) => {
                            this.api.hideLoader();
                            if (res.success) {
                                this.appsFlyerAnalytics("MD", this.bookingId,
                                "",res.actualrevenue, res.minderId, res.ownerid)
                                this.socket.emit('initial-messages', this.socketArray);   

                            } else {
                                this.api.showToast(res.error, "3000", "bottom");
                                this.socket.emit('initial-messages', this.socketArray);   
                            }
                        }, (err: any) => {
                            this.api.autoLogout(err, this.bookingId);
                        });
                }
            }
        ]
    }); await alert.present();
  }

  appsFlyerAnalytics(bookingStatus, bookingId, potentional_revenue,actual_revenue, minderId, owenerId) {
    const booking = {
        af_booking_status: bookingStatus,
        af_booking_id: bookingId,
        af_minder_id: minderId,
        af_owner_id: owenerId,
        af_potentional_revenue:potentional_revenue,
        af_actual_revenue:actual_revenue
    }
    this.appsFlyerService.bookingEvent(booking);
  }

  async walletBalanceAPICheck() {
    const alert = await this.alertController.create({
      header: 'CONFIRM BOOKING FOR PET OWNER',
      subHeader: 'By clicking on OK, you indicate that you have met this Pet Lover and happy to confirm this booking. We will now process a payment (Pay now only for 2 weeks if it’s a recurring booking). All bookings are covered with Pet Sitter Liability Insurance up to $10M',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary',

        }, {
          text: 'Ok',
          handler: async (data) => {
            const param = { id: this.bookingId };
            this.api.showLoader();
            this.api.walletCheckBalanceSocket(param).pipe(finalize(() => {
              this.api.hideLoader();
            })).subscribe(async (res: any) => {
              if (res.status) {
                this.socket.emit('initial-messages', this.socketArray);
              } else {
                if (res.checkout) {
                  this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, true, "confrimMyRemoteBooking");
                } else if(res.error) {
                  this.api.showAlert('Booking Alert', res.error, [{text: 'OK'}]);
                } else {
                  this.api.showToast("Something went wrong", "3000", "bottom");
                }
              }
              }, err => {
                this.api.autoLogout(err, param);
              })
            }
          }
        ]
      }); 
      await alert.present();
  }
  
  async walletBookingCheckOutModel(booking_amount, wallet_balance, isBalanceCheck, methodName) {
    const modal = await this.modalCtrl.create({
      component: WalletBookingCheckoutComponent,
      animated: true,
      componentProps: {
        bookingId: this.bookingId,
        amount: booking_amount,
        available_wallet_balance: wallet_balance,
        isBalanceCheck,
        methodName
      }
    });
    modal.onDidDismiss().then((data) => {
        if(data.role == 'socketSuccess') {
          this.socket.emit('initial-messages', this.socketArray);   
        }
      });
    return await modal.present();
  }

  async goToMessageDetails() {
    const modal = await this.modalCtrl.create({
      component: MessageDetailPage,
      animated: true,
      componentProps: {
        chatBookingId: this.bookingId,
        onlyProfile: true
      }
    });
    modal.onDidDismiss().then((data) => {
      this.socket.emit('initial-messages', this.socketArray);
    });
    return await modal.present();
  }
}
