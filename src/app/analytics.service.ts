import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { filter } from 'rxjs/operators';
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from './api/petcloud-api.service';
import { User } from './model/user';
import {environment} from '../environments/environment';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;
  userId: any = ""
 
  constructor( private router: Router,public device: Device,
    public firebase: FirebaseX,
    public storage: Storage,
    public platform: Platform) {
    this.router.events.pipe(
      filter((e: RouterEvent) => e instanceof NavigationEnd),
    ).subscribe((e: RouterEvent) => {
      if(environment.production){
        this.setScreenName(e.url)
       }
  });
  }

  getInfo(){
   this.storage.get(PetcloudApiService.USER).then((user: User)=>{
     if(user != null){
      this.userId = user.id;
     }
   })
  }

  async setUser() {
    await this.getInfo();
    if(environment.production){
      await this.platform.ready();
      this.firebase.setUserId(this.userId)
     }
  }
 
  async logEvent(type: string, data: object){
    if(environment.production){
      await this.platform.ready();
      this.firebase.logEvent(type,data).then((isLogged: any)=>{
        console.log("is logged", isLogged);
      }).catch((err=>{
        console.log("error", err);
      }))
     }
  }

  async setScreenName(screeName){
     if(environment.production){
      await this.platform.ready();
      this.firebase.setScreenName(screeName)
     }
  }
 
  setProperty(name, value) {
    if(environment.production){
      const param: any = {
        name,
        value
    }
      // this.firebase.setUserProperty(name, param);
    }
  }
 
  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;
    //  this.firebase.setCrashlyticsCollectionEnabled(this.analyticsEnabled)
  }
}
