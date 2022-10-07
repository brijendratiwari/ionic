import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {PetcloudApiService} from '../../app/api/petcloud-api.service';
import {Router} from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { Events } from '../events';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    @ViewChild('myTabs',{read:true}) tabs: IonTabs;
    userType : any = "";
    private routeSubscrible = new Subscription();
    private  events = null;
    
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
         protected storage: Storage,
         private router: Router, 
         public api: PetcloudApiService) {

            this.routeSubscrible.add(
                PMEvents.subscribe("menuName", (data) => {
                    console.log("menuName data", data);
                    if (data == true) {
                      this.storage.get("menuType").then((res) => {
                        if(res != null){
                            this.userType = res;
                        }
                      });
                    }else{
                        this.storage.get("menuType").then((res) => {
                            if(res != null){
                                this.userType = res;
                            }else{
                            }
                          });
                    }
                })    
            )

            this.storage.get("menuType").then((res) => {
              if(res != null){
                  this.userType = res;
              }else{
                // this.router.navigateByUrl('/home/tabs/expore')
              }
            });

        }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.events = null;
        this.routeSubscrible.unsubscribe();
      }
    
    public sliderOpts = {
        slidesPerView: 2.5
    };

    getSelectedTab(event){
    
        this.api.isHomeTabsChanged = true;
        console.log("Selected Tab Name", event.tab);
        event.tab == "get-started" ? this.tabSelected.isMessageNullTab = true : this.tabSelected.isMessageNullTab  = false   
        event.tab == "explore" ? this.tabSelected.isExploreScreen = true : this.tabSelected.isExploreScreen = false;
        event.tab == "jobs-tab" ? this.tabSelected.isViewJobSelected = true : this.tabSelected.isViewJobSelected = false
        event.tab == "sitter-listing" ? this.tabSelected.isSitterScreen = true : this.tabSelected.isSitterScreen  = false
        event.tab == "messages" ? this.tabSelected.isMessageSelected = true : this.tabSelected.isMessageSelected  = false
        event.tab == "profile-menu" ? this.tabSelected.isProfileSelected = true : this.tabSelected.isProfileSelected = false       
    }
}
