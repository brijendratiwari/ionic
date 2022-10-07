import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  NavController,
  Platform,
  LoadingController,
} from "@ionic/angular";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { Storage } from "@ionic/storage";
import { finalize } from "rxjs/operators";
import { filter } from "rxjs/operators";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { MessageFilterComponent } from "../messages/message-filter/message-filter.component";
import { LeaveaReviewComponent } from "../messages/leavea-review/leavea-review.component";
import { User } from "../model/user";
import { Subscription } from "rxjs";
import * as moment from 'moment';
import { ChatscreenComponent } from "../chatscreen/chatscreen.component";
import { AnalyticsService } from "../analytics.service";
import { RemoteChatScreenComponent } from "../remote-chat-screen/remote-chat-screen.component";

@Component({
  selector: "app-messages-list",
  templateUrl: "./messages-list.page.html",
  styleUrls: ["./messages-list.page.scss"],
})
export class MessagesListPage implements OnInit {
  // public selectedSegment = 'inbox';
  // object for store filter data.
  public filterList = {
    viewAs: "",
    filterByStage: "",
  };
  // userId
  public userId: any;
  public user: User;
  public selectedMessengingSegment: any = "";
  //Pagiantion
  public page: any = 1;
  public isDataAvailable: boolean = false;
  public isMinder: boolean = false;
  userType: any;
  // flag for check inbox all messages are empty
  // main message variable to store original data without fitlerd result all time;
  // second message variable to store original and after filterd result.
  public listing: any = [];
  public status: any = 0; // Filter Status
  public viewAs: any = 0;
  // public filterCode = '';
  public filterData = { filterByStage: "", viewAs: "" };
  isModelClick: boolean = false;
  isMessagePaginationShown: boolean = false;
  isAPILoaded: boolean = false;
  favSitters: any = [];
  isFirstLoad: boolean = true;

  private _routerMessageSub = new Subscription();
  constructor(
    public api: PetcloudApiService,
    public analytics: AnalyticsService,
    public modalCtrl: ModalController,
    public platform: Platform,
    public loading: LoadingController,
    private router: Router,
    protected storage: Storage,
    public navcntl: NavController,
    protected route: ActivatedRoute
  ) {
    this.listing = []

    this._routerMessageSub.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(async (event: any) => {

          if (
            event.url == "/home/tabs/messages" ||
            event.url == "/home/tabs/messages-list" ||
            event.url == "/home/tabs/messages/messages-list"
          ) {
            this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
              if (res != null) {
                this.listing = [];
                this.isAPILoaded = false;
                this.isDataAvailable = false
                this.isMessagePaginationShown = false;
                this.page = 1;
                this.isFirstLoad = true;
                await this.getInfo();
                this.selectedMessengingSegment = "message";
                await this.getInboxMessage(this.page, this.status, "", "");
              } else {
                // this._routerMessageSub.unsubscribe();
                this.api.SignInWindow();
              }
            });
          }
        })
    );
  }

  ngOnInit() {

  }

  ionViewWillLeave() {
    localStorage.removeItem("messages");
    localStorage.removeItem("filterByStage");
    localStorage.removeItem("viewAs");
  }

  ngOnDestroy() {
    this._routerMessageSub.unsubscribe();
  }

  async getInboxMessage(page, status, usertype, infiniteScroll) {
    // Check Every array which is Minder by comparing user id and owner Id
    // @Logic Given by Nitin
    // if onwerid == user.id then show minder data
    // if minderId == user.id then show owner data

    if (page === 1 && this.isFirstLoad) {
      this.api.showLoader();
      this.isFirstLoad = false;
    }
    this.api.getInboxMessage(page, status, usertype).pipe(
      finalize(() => {
        this.isMessagePaginationShown = true;
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      })
    ).subscribe(
      async (res: any) => {
        if (res.success) {

          if (res?.messages?.length > 0) {
            const messageData: [] = await res.messages;
            messageData.forEach(((data: any) => {
              data.startDate =  moment(data.startDate).format("MMM DD YYYY, h:mm A");
                data.endDate = data.endDate != "" ?  moment(data.endDate).format("MMM DD YYYY, h:mm A") : "";
                data.modifydate = data.modifydate != "" ?  moment(data.modifydate).format("MMM DD YYYY, h:mm A") : "";
              const index = this.listing.findIndex((resp) => resp.id == data.id);
              if(index>-1) {
                this.listing[index] = data;
              } else {
                this.listing.push(data);
              }
            }));
          }
        }
        if(this.listing?.length>0) {
          this.isDataAvailable = true;
          this.listing.sort((a, b) => new Date(b?.lastContactDate).getTime() - new Date(a?.lastContactDate).getTime());
          localStorage.setItem("messages", this.listing);
          if(res?.pagination?.totalResults == this.listing.length) {
            this.isMessagePaginationShown = false;
          } else {
            this.isMessagePaginationShown = true;
          }
        } else {
          this.isDataAvailable = false;
          this.isMessagePaginationShown = false;
        }
        this.isAPILoaded = true;
        this.api.hideLoader();
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      (err: any) => {
        this.isAPILoaded = true;
        this.api.hideLoader();
        this.api.autoLogout(err, { page, status, usertype });
      }
    )
  }

  /**
   * show all filters via Modal (drawer).
   * @param ev events capture
   */
  async showFilter(ev: any) {
    this.isModelClick = true;
    const modal = await this.modalCtrl.create({
      component: MessageFilterComponent,
      animated: true,
      componentProps: {
        viewAs: this.filterList?.viewAs? this.filterList.viewAs : 'all',
        filterByStage: this.filterList?.filterByStage? this.filterList.filterByStage : '0'
      }
    });
    modal.onDidDismiss().then((data: any) => {
      this.isModelClick = false;
      if (data.data != undefined) {
        if (data.data.filterByStage == "clear" && data.data.viewAs == "clear") {
        } else {
          this.filterList = data.data;
          this.applyMessageFilter(
            this.filterList["viewAs"],
            this.filterList["filterByStage"]
          );
        }
      }
    });
    return await modal.present();
  }

  /**
   * Redirect on message details page to show more details of message.
   * @param pastMsg Message Object
   */
  public async messageDetail(msg: any) {
    console.log('msg', msg);
    
  if(msg.messageView==2 || msg.messageView=='2') {
    let otherUserImage;
    let toName = msg.minder.first_name == this.user.first_name ? msg.owner.first_name : msg.minder.first_name;
    let sendPush = msg.minder.first_name == this.user.first_name ? msg.owner.sendMePush : msg.minder.sendMePush;
    otherUserImage = msg.owner.imagename == this.user.imagename ? msg.minder.imagename : msg.owner.imagename;
    await this.remoteChatScreenWindow(msg.id,msg.minderId,msg.ownerid,this.userId,this.user.imagename,
      otherUserImage,this.user.first_name,toName,sendPush,msg.startDate,msg.endDate,msg.servicetype.serviceName,msg?.service?.total,
      msg.booking_status)
    } else if(msg.booking_status == "CURR" || msg.booking_status == "MD"){

      if(msg.booking_status == "MD"){
        this.analytics.logEvent(PetcloudApiService.meetgreetcomplete,{userId:this.userId});
      }
      let otherUserImage;
      let toName = msg.minder.first_name == this.user.first_name ? msg.owner.first_name : msg.minder.first_name;
      let sendPush = msg.minder.first_name == this.user.first_name ? msg.owner.sendMePush : msg.minder.sendMePush;
      otherUserImage = msg.owner.imagename == this.user.imagename ? msg.minder.imagename : msg.owner.imagename;      
      await this.chatScreenWindow(msg.id,msg.minderId,msg.ownerid,this.userId,this.user.imagename,
        otherUserImage,this.user.first_name,toName,sendPush,msg.startDate,msg.endDate,msg.servicetype.serviceName,msg?.service?.total,
        msg.booking_status)
      } else{
    this.router.navigate(["/message-detail"], {
      queryParams: { id: msg.id },
    });
    }
  }

  public favouriteSitterList() {

    this.api.getFavouriteSitter()
      .pipe(finalize(() => {
      }))
      .subscribe((res: any) => {
        if (res) {
          this.favSitters = res;
        } 
      }, (err: any) => {
        this.api.showToast('favourite sitters not found, Try again!', 2000, 'bottom');
      });
  }

  /**
   * Apply filter in message list
   * @param viewAs param of ViewAs
   * @param filterByStage param of filterByStage
   */
  public applyMessageFilter(viewAs: any, filterByStage: any) {
   
    if (
      (viewAs === "clear" || viewAs == "0") &&
      (filterByStage === "clear" || filterByStage == "0")
    ) {
      const originalMessageData = JSON.parse(localStorage.getItem("messages"));
      this.listing = originalMessageData;
    } else {
      this.listing = [];
      this.page = 1;
      localStorage.setItem("filterByStage", filterByStage);
      localStorage.setItem("viewAs", viewAs);

      this.isFirstLoad = true;
      this.storage.set("viewAs", viewAs);
      this.getInboxMessage(this.page, filterByStage, viewAs, ""); // FilterByStage is for Status
    }
  }

  loadData(infiniteScroll) {
    let filterByView;
    let viewAs;

    localStorage.getItem("filterByStage") == null || "" || undefined
      ? (filterByView = 0)
      : (filterByView = localStorage.getItem("filterByStage"));

    localStorage.getItem("viewAs") == null || "" || undefined
      ? (viewAs = 0)
      : (viewAs = localStorage.getItem("viewAs"));
    this.page = this.page + 1;

    this.getInboxMessage(this.page, filterByView, viewAs, infiniteScroll);
  }

  async navigateLeaveReview(bookingID,messageDetails) {
    const modal = await this.modalCtrl.create({
      component: LeaveaReviewComponent,
      animated: true,
      componentProps: {
        id: bookingID, // BookingID,
        messageDetails
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.listing = [];
      this.page = 1;
      this.isMessagePaginationShown = false;
      this.getInboxMessage(1, 0, 0, "");
    });
    return await modal.present();
  }

  rebook(message) {
    const availabilityData = {
      sitterId: message.minder.id,
      sitterName: message.minder.first_name,
      primaryService: message.primaryService,
      secondaryService: message.secondaryService,
      isRebook: true,
    };
    this.storage.set("availabilitySitter", availabilityData);
    this.router.navigateByUrl("/check-availability");
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      (user: User) => {
        this.user = user;
        this.userId = user.id;
        this.favouriteSitterList();
      },
      (err) => {
        
      }
    );
  }

  public async chatScreenWindow(id,minderId,ownerId,userId,currentUserImage,
    otherUserImage,fromName,toName,sendPush,dropOff,pickUp,serviceName,amount,bookingStatus) {

    const modal = await this.modalCtrl.create({
      component: ChatscreenComponent,
      animated: true,
      componentProps: {
        id,
        minderId,
        ownerId,
        userId,
        currentUserImage,
        otherUserImage,
        fromName,
        toName,
        sendPush,
        dropOff,
        pickUp,
        serviceName,
        amount,
        bookingStatus
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
      });
    return await modal.present();

  }

  public async remoteChatScreenWindow(id,minderId,ownerId,userId,currentUserImage,
    otherUserImage,fromName,toName,sendPush,dropOff,pickUp,serviceName,amount,bookingStatus) {

    const modal = await this.modalCtrl.create({
      component: RemoteChatScreenComponent,
      animated: true,
      componentProps: {
        id,
        minderId,
        ownerId,
        userId,
        currentUserImage,
        otherUserImage,
        fromName,
        toName,
        sendPush,
        dropOff,
        pickUp,
        serviceName,
        amount,
        bookingStatus
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        // this.getInboxMessage(1, 0, 0, "");
        this.reshowFilterData();
      });
    return await modal.present();

  }
  reshowFilterData() {
    let filterByView;
    let viewAs;

    localStorage.getItem("filterByStage") == null || "" || undefined
      ? (filterByView = 0)
      : (filterByView = localStorage.getItem("filterByStage"));

    localStorage.getItem("viewAs") == null || "" || undefined
      ? (viewAs = 0)
      : (viewAs = localStorage.getItem("viewAs"));
    this.page = this.page + 1;

    this.getInboxMessage(1, filterByView, viewAs, "");
  }
}

