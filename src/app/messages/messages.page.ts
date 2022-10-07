import { Component, OnInit, OnDestroy, ViewChild, Inject } from "@angular/core";
import { PetcloudApiService } from "../api/petcloud-api.service";
import {
  ModalController,
  NavController,
  Platform,
  LoadingController,
  IonTabs,
} from "@ionic/angular";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Storage } from "@ionic/storage";
import { filter } from "rxjs/operators";
import { User } from "../model/user";
import { Subscription } from 'rxjs';
import { Events } from "../events";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"],
})
export class MessagesPage implements OnInit {

  private _routerMsgPageSub = new Subscription();
  public selectedMessengingSegment: any = "";
  userType: any = "";
  menuType: any = "sitter"
  @ViewChild('messengingTabs',{read:true}) tabs: IonTabs;
  isJobListingCss: boolean = false;
  isMessageListingCss: boolean = true

  constructor(
    public api: PetcloudApiService,
    public modalCtrl: ModalController,
    public platform: Platform,
    public loading: LoadingController,
    private router: Router,
    protected storage: Storage,
    public navcntl: NavController,
    public route: ActivatedRoute,
    public navCntl: NavController,
    public mEvents:Events,
  ) {

    this._routerMsgPageSub.add(
      this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
 
        if (event.url == "/home/tabs/messages") {
        
          this.storage.get(PetcloudApiService.USER).then((res: User) => {
            if (res != null) {
              if (event.url == "/home/tabs/messages") {
                this.isMessageListingCss = true;
                this.isJobListingCss = false;
                this.getInfo();
              }else{
                this.isJobListingCss = true;
                this.isMessageListingCss = false;
              }
            }
          });


          this.mEvents.subscribe("menuName", (data) => {
            console.log("menu name", data.menuType);
              this.menuType = data.menuType;
          })  
        }
      })
    ) 
    this.backButtonEvent();
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this._routerMsgPageSub.unsubscribe();
  }


  navigateTo(pageName) {
    if (pageName == "messages-list") {
      this.isMessageListingCss = true;
      this.isJobListingCss = false;
    } else {
      this.isJobListingCss = true;
      this.isMessageListingCss = false;
    }
    this.router.navigate(['/home/tabs/messages/' + pageName])
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      async (user: User) => {
        if (user != null) {
           this.api.isVerificationPendingModel();
        }

      },
      (err) => {
        
      }
    );
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
      if (this.router.url === "/home/tabs/messages" || this.router.url == "/home/tabs/messages/messages-list") {
        this.navCntl.navigateRoot("/home/tabs/sitter-listing")
      }
    });
  }
}
