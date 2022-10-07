import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController, Platform, PopoverController, IonContent, AlertController, } from "@ionic/angular";
import { ChatServiceService } from "../chat-service.service";
import { Chat } from "../model/chat";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Chatter } from "../model/chatter";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import * as firebase from "firebase";
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


@Component({
  selector: "app-chatscreen",
  templateUrl: "./chatscreen.component.html",
  styleUrls: ["./chatscreen.component.scss"]
})
export class ChatscreenComponent implements OnInit {
  bookingId: any;
  userId: any;
  minderId: any;
  ownerId: any;
  currentUserImage: any;
  otherUserImage: any;
  chats: Array<Chat>;
  public checkTyping: boolean = false;
  public currentUserDataModel: any;
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
    public appsFlyerService: AppsFlyerService
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

    this.bookingStatus == "A" || this.bookingStatus == "PP" ? this.isMeetGreetButtonVisible = true : this.isMeetGreetButtonVisible = false;
    this.bookingStatus == "MD" || this.bookingStatus == "CURR" || this.bookingStatus == "C" || this.bookingStatus == "CAN" || this.bookingStatus == "E" ? this.isButtonVisible = false : this.isButtonVisible = true;
    this.analytics.logEvent(PetcloudApiService.chatscreen, { userId: this.userId });

    let userModel: Chatter = {
      userId: this.userId,
      isOnline: true,
      isTyping: false,
      lastSeen: this.api.getDateTime(),
      type: this.type,
      fcmToken: this.fcmToken,
    };
    this.updateisTypingFlag(userModel);

    this.getUsers();
    this.getChats();

    this.update();
  }

  private update() {
    this.backgroundMode.on("activate").subscribe(() => {
      this.backgroundMode.disableWebViewOptimizations();
      this.currentUserDataModel = true
      this.platform.resume.subscribe(() => {
        let userModel: Chatter = {
          userId: this.userId,
          isOnline: true,
          isTyping: false,
          lastSeen: this.api.getDateTime(),
          type: this.type,
          fcmToken: this.fcmToken,
        };
        this.updateisTypingFlag(userModel);
      });

      this.platform.pause.subscribe(() => {
        this.currentUserDataModel = false
        let userModel: Chatter = {
          userId: this.userId,
          isOnline: false,
          isTyping: false,
          lastSeen: this.api.getDateTime(),
          type: this.type,
          fcmToken: this.fcmToken,
        };
        this.updateisTypingFlag(userModel);
      });
    });
  }

  ngOnInit() {
    this.currentUserDataModel = true;
  }


  scrollToBottom() {
    if (this.chatLength) {
      let chatContainer = document.querySelector('.chat-list');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.currentUserDataModel = false
    this.destroyOnlineFlag();
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
      this.upload("data:image/jpeg;base64," + base64String);
    }, err => { })
  }

  upload(dataURL) {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename =
      "Image" +
      "b" +
      this.bookingId +
      "Id" +
      (Math.floor(1000 + Math.random() * 900000) + 1);
    const imageRef = storageRef.child(this.bookingId + "/" + filename + ".jpg");
    //File reference
    const fileRef = this.storage.ref(this.bookingId + "/" + filename + ".jpg");
    this.api.showLoader();
    imageRef
      .putString(dataURL, firebase.storage.StringFormat.DATA_URL)
      .then((snapshot) => {
        this.api.hideLoader();
        let fileURL = fileRef.getDownloadURL();
        fileURL.subscribe((resp) => {

          this.saveImagePath(resp);
        });
      });
  }

  SaveImageRef(filePath, file) {
    return {
      task: this.afs.upload(filePath, file),
      ref: this.afs.ref(filePath),
    };
  }

  getChats() {

    this.chatsService.getChats(this.bookingId, this.userId).pipe(finalize(() => {
      this.api.showLoader();
    })).subscribe(
      (res: Chat[]) => {
        this.chats = res;
        res.forEach(chat => {
          chat.dateTime = this.convertUTCDateToLocalDate(new Date(chat.dateTime));
        });

        if (this.chats.length) {
          this.chatLength = this.chats.length - 1;
          // this.scrollToBottom();
        }
      },
      (err) => {
        this.api.hideLoader();
      }
    );
  }

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return newDate;
  }

  getUsers() {
    let oppType = this.userId == this.ownerId ? "minder" : "owner";
    // for other user
    let doc = firebase.firestore().collection(oppType).doc(this.bookingId);
    let observer = doc.onSnapshot(docSnapshot => {
      this.userModelUpdatedFlags = docSnapshot.data();
      if (this.userModelUpdatedFlags != undefined
        && this.currentUserDataModel) {
        this.userFlags = this.userModelUpdatedFlags.userModel;
        this.isOnline = this.userFlags.isOnline == true ? "Online" : "Offline";
        this.isTyping = this.userFlags.isTyping;
        this.lastSeen = this.convertUTCDateToLocalDate(new Date(this.userFlags.lastSeen));
        this.sendPushToken = this.userFlags.fcmToken;
        this.updateReadStatus();
      }
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
  }

  pushToken(message, imagePath) {
    if (this.isOnline == "Offline" && this.sendPush == 1) {
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

          }
        );
      }
    } else {
    }
  }

  async updateReadStatus() {
    if (this.isOnline == "Online") {

      const collection = await firebase
        .firestore()
        .collection(this.bookingId)
        .get();
      collection.forEach(
        (doc) => {
          doc.ref.update({ isMessageScene: true });
        },
        (response) => {
          console.log("Response", response);
        }
      );
    }
  }

  sendMessage() {

    const to = this.userId == this.minderId ? this.ownerId : this.minderId;
    if (this.chatMessage != "" || this.petReport != undefined) {

      if (this.petReport != "" || this.chatMessage.replace(/^\s+/, "").replace(/\s+$/, "")) {
        let chat: Chat = {
          from: this.userId,
          message: this.chatMessage,
          type: "message",
          to,
          picture: null,
          dateTime: this.api.getDateTime(),
          isMessageScene: this.isOnline == "Online" ? true : false,
          petReport: this.petReport == undefined ? "" : this.petReport
        };

        this.pushToken(this.chatMessage, "");

        // this.scrollToBottom();

        this.chatsService.addChats(chat, this.bookingId).then(
          (res: any) => {
            //this.docIdUpdate = res.id;
            let userModel = {
              isTyping: false
            }

            this.addChatToPetCloudDB(chat.message, chat.picture);
            this.updateisTypingFlag(userModel);

          },
          (err: any) => {
            console.log("Err", err);
          }
        );

        this.chatMessage = "";
        // this.scrollToBottom();
      }
    }
  }

  addChatToPetCloudDB(chatMessage, image) {

    const messageDetail = {
      bookingId: this.bookingId,
      message: chatMessage == null ? "" : chatMessage,
      image: image == null ? "" : image
    }

    // Add user chat data to pet cloud server..
    this.api.addChatToPetCloudDB(messageDetail).subscribe(data => {
      console.log(data);
    }, err => {
      this.api.autoLogout(err, "")
    })
  }

  saveImagePath(imagePath) {
    const to = this.userId == this.minderId ? this.ownerId : this.minderId;
    let chat: Chat = {
      from: this.userId,
      message: "",
      type: "image",
      to: to,
      picture: imagePath,
      dateTime: this.api.getDateTime(),
      isMessageScene: this.isOnline == "Online" ? true : false,
      petReport: this.petReport == undefined ? "" : this.petReport
    };
    // this.pushToken(this.chatMessage, imagePath);
    this.api.showLoader();
    this.chatsService.addChats(chat, this.bookingId).then(
      (res: any) => {
        this.api.hideLoader();

        this.addChatToPetCloudDB(null, chat.picture);
        this.pushToken(this.chatMessage, imagePath);

      },
      (err: any) => {
        this.api.hideLoader();
        console.log("Err", err);
      }
    );
  }

  //Detect isTyping
  isMessageonChange(event) {

    if (event.value.length == 0) {
      let userModel = {
        isTyping: false
      }
      this.updateisTypingFlag(userModel);
    } if (event.value.length == 1) {
      let userModel = {
        isTyping: true
      }
      this.updateisTypingFlag(userModel);
    }
  }

  destroyOnlineFlag() {
    this.currentUserDataModel = false
    let userModel: Chatter = {
      userId: this.userId,
      isOnline: false,
      isTyping: false,
      lastSeen: this.api.getDateTime(),
      type: this.type,
      fcmToken: this.fcmToken,
    };
    this.updateisTypingFlag(userModel);
  }

  updateisTypingFlag(userModel) {
    let type = this.userId == this.ownerId ? "owner" : "minder";

    this.afStore.collection(type).doc(this.bookingId).set({
      userModel
    }, { merge: true }).then(res => {
    }, err => {
      console.log("Err=================", err);
    });
  }

  openMoreOptionsforSharing(event) {
    if (event.detail.value == "camera") {
      this.pickImage(0);
    } else if (event.detail.value == "gallary") {
      this.pickImage(1);
    } else if (event.detail.value == "petreport") {
      this.petReportModel();
    }
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

  async viewPetReport(petReport) {
    const modal = await this.modalCtrl.create({
      component: ViewPetReportComponent,
      animated: true,
      componentProps: {
        petReport
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

  goToMessageDetails() {
    this.closeModal()
    this.router.navigate(["/message-detail"], {
      queryParams: { id: this.bookingId },
    });
  }


  async meetandGreet() {

    if (this.bookingStatus == "PP") {

      // Fist calling booking authorized API
        const param = {
            id: this.bookingId
        }
        this.api.showLoader();
        this.api.authorizeBookingViaWallet(param)
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe(async (res: any) => {
                if (res.success) {
                    // potential revenue will be 100 when balance is already available in wallet.
                     this.appsFlyerAnalytics("A", this.bookingId,
                    "100","", this.minderId, this.ownerId)
                    this.analytics.logEvent(PetcloudApiService.preauthorized, { userId: this.userId });
                    this.meetGreetComponent(); // Once booking is authorized we call meet and greet
                } else {
                    if (res.checkout) {
                        this.api.showToast(res.error, "3000", "bottom");
                        this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, false, "confrimMyBooking")
                    } else {
                        this.api.showToast("Something went wrong", "3000", "bottom");
                    }
                }
            }, err => {
                this.api.autoLogout(err, param);
          })

    } else {
      this.meetGreetComponent();
    }
  }

  public async meetGreetComponent() {
    const modal = await this.modalCtrl.create({
      component: MeetandGreetComponentComponent,
      animated: true,
      componentProps: {
        id: this.bookingId, // BookingID
        isMeetandGreetEdit: false
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        data.data == "refreshchatscreen" ? this.isMeetGreetButtonVisible = false : this.isMeetGreetButtonVisible = true;
      });
    return await modal.present();
  }

  async walletCheckBalance() {
    const alert = await this.alertController.create({
      header: 'Confirm MY BOOKING',
      subHeader: 'By clicking on OK, you indicate that you have met this Pet Lover and happy to confirm this booking. We will now process a payment (Pay now only for 2 weeks if it’s a recurring booking). All bookings are covered with Pet Sitter Liability Insurance up to $10M',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary',

        }, {
          text: 'Ok',
          handler: (data) => {
            this.walletBalanceAPICheck()
          }
        }
      ]
    });
    await alert.present();
  }


  walletBalanceAPICheck() {

    const param = { id: this.bookingId };
    this.api.showLoader();
    this.api.walletCheckBalance(param).pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe(async (res: any) => {
      if (res.status) {
        this.confrimMyBooking();
      } else {
        if (res.checkout) {
          this.walletBookingCheckOutModel(res.booking_amount, res.wallet_balance, true, "confrimMyBooking");
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
    modal.onDidDismiss()
      .then((data: any) => {
        this.closeModal();
      });
    return await modal.present();
  }

  // Confrim My Booking Status is M
  async confrimMyBooking() {
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
          handler: (data) => {

            this.api.showLoader();
            this.api.ownerconfirmBooking(this.bookingId)
              .subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                  this.appsFlyerAnalytics(
                    "MD", this.bookingId, "", "", this.minderId,
                    this.ownerId)
                  this.api.showToast(res.message, 2000, 'bottom');
                  this.isButtonVisible = false;
                } else {
                  this.api.showToast(res.message, 2000, 'bottom');
                }
              }, (err: any) => {
                this.api.autoLogout(err, this.bookingId);
              });
          }
        }
      ]
    }); await alert.present();
  }

  closeModal() {
    this.destroyOnlineFlag();
    this.modal.dismiss().then(() => { this.modal = null; });
  }

  appsFlyerAnalytics(bookingStatus, bookingId, potentional_revenue, actual_revenue, minderId, owenerId) {
    const booking = {
      af_booking_status: bookingStatus,
      af_booking_id: bookingId,
      af_minder_id: minderId,
      af_owner_id: owenerId,
      af_potentional_revenue: potentional_revenue,
      af_actual_revenue: actual_revenue
    }
    this.appsFlyerService.bookingEvent(booking);
  }

}
