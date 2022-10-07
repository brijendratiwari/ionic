import { Injectable } from '@angular/core';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import {environment} from '../environments/environment';
import * as moment from 'moment';
import { AppVersion } from "@ionic-native/app-version/ngx";
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from './api/petcloud-api.service';
import { User } from './model/user';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Events } from './events';

@Injectable({
  providedIn: 'root'
})
export class AppsFlyerService {
  versionCode: any = ""
  count: 0;
  userid: any;
  private _routerSub = new Subscription();
  constructor(public appsFlyer:Appsflyer,
    public device:Device,
    public storage:Storage,
    public router:Router,
    public events: Events,
    public platform:Platform,public appVersion:AppVersion) {}


  public logEvent(eventName,eventValue){
    if(environment.production){
         this.appsFlyer.logEvent(eventName,eventValue);
    }else{
        this.appsFlyer.logEvent(eventName,eventValue);
    }
  }

  public registerToken(token){
  if(environment.production){
      this.appsFlyer.registerUninstall(token);
    }
  }

  public dateFormat = () => {
   return moment(new Date()).format("M/DD/YYYY");
  }

  public userId() {
    if(localStorage.getItem("token") != null ){
      this.events.subscribe("user", (data) => {
        if(data){
          this.storage.set("user",data);
         this.userid = data.id;
        }else{
          this.storage.get(PetcloudApiService.USER).then((user:User)=>{
            if(user){
              this.userid = user.id
            }
          })
        } 
    }) 
  
    this.storage.get(PetcloudApiService.USER).then((user:User)=>{
      if(user){
        this.userid = user.id
      }
    })
    }else{
      this.userid = ""
    }
     
}

  public registerUninstallToken = (token) => {
    this.appsFlyer.registerUninstall(token)
  }


  getVersionCode(){
    if(this.platform.is("cordova")){
      this.appVersion.getVersionCode().then(data=>{
        this.versionCode = data;
      }) 
    }
  }
  
   public  getCurrentVersionCode()  {
      if(this.platform.is("cordova")){
        this.getVersionCode()
        return this.versionCode;
      }
  }

  public platformName = () => {
    if(this.platform.is("cordova")){
      return this.device.platform;
    }
  }

  public loginAnalytics = (eventValue) => {
    this.logEvent("login",eventValue)
  }

  public singupAnalytics = (eventValue) => {
    this.logEvent("sign_up",eventValue)
  }

  public logoutAnalytics = (eventValue) => {
    this.logEvent("logout",eventValue)
  }

  public postJobAnalytics = (eventValue) => {
    this.logEvent("job_posted",eventValue)
  }


  public profileUpdatedAnalytics = (eventName) => {
    this.logEvent("profile_updated",eventName)
  }

  public appOpenedAnalytics = (eventValue) =>{
    console.log("inside apps flyer analytics")
    this.logEvent("app_opened",eventValue);
  }

  public bookingState = (eventValue) => {
    const bookingStatusName = "af_booking_"+eventValue.af_booking_status;
    this.logEvent(bookingStatusName,eventValue)
  }

  public bookingEvent = (params) => {
    // when booking status is Authorized then for showing revenue in dashboard key will remain same as af_revenue.
    // potentail revue generated during authorization.
    // actual revenue generated during MD status.    
      const booking = {
        af_user_id: this.userid,
        af_booking_status:params.af_booking_status,
        af_owner_id:params.af_owner_id,
        af_minder_id:params.af_minder_id,
        af_booking_id:params.af_booking_id,
        af_potentional_revenue:params.af_potentional_revenue,
        af_revenue: params.af_booking_status == "A" ? params.af_potentional_revenue : params.af_actual_revenue,
        app_version:this.getCurrentVersionCode(),
        app_type:this.platformName(),
      }
       this.bookingState(booking)
  }
}
