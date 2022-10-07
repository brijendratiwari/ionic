import { Component, OnInit } from '@angular/core';
import { Market } from '@ionic-native/market/ngx';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from "@ionic/storage";
import { User } from '../model/user';
import { AuthenticationService } from '../services/authentication.service';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-forceupdate',
  templateUrl: './forceupdate.page.html',
  styleUrls: ['./forceupdate.page.scss'],
})
export class ForceupdatePage implements OnInit {
  isSaveLoginKeyPress = "";
  email: any;
  password: any
  constructor(public market: Market,
    public storage: Storage,
    public auth: AuthenticationService,
    public navCtrl: NavController,
    public plt: Platform,
    public api: PetcloudApiService) { }

  ngOnInit() {
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
  }

  async updateApp(){


    let appId;

    if (this.plt.is("android")) {
      appId = "com.petcloud.petcloud"
    } else {
      appId =  "id1539909889"
    }

    
   await this.market.open(appId).then(async res=>{
      console.log("market res",res);
      if(res){
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
            localStorage.setItem("token","");
        await this.storage
            .remove(PetcloudApiService.USER)
            .then(async (res: any) => {
                this.api.logoutUser().subscribe(
                    async (logRes: any) => {
                        await this.storage
                            .remove(PetcloudApiService.USERTOKEN)
                            .then((res: any) => {
                                console.warn("token removed!");
                            });
                    },
                    (err: any) => {
                        // this.api.autoLogout(err);
                    }
                );
                this.api.hideLoader();
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
                    // this.navCtrl.navigateRoot("/login");
                } else {
                    // this.navCtrl.navigateRoot("/get-started");
                }
            });
      }
    })
  }

}
