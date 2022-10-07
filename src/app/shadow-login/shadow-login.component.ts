import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { ApiResponse } from '../model/api-response';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';
import { Events } from '../events';


@Component({
  selector: 'app-shadow-login',
  templateUrl: './shadow-login.component.html',
  styleUrls: ['./shadow-login.component.scss'],
})
export class ShadowLoginComponent implements OnInit {

  public shadowLoginForm: FormGroup;
  public accessToken: string = "";
  public adminEmail: string = ""

  constructor(public model: ModalController, public formBuilder: FormBuilder,
    public api: PetcloudApiService,
    public events: Events,
    public router: Router,
    public authService: AuthenticationService,
    protected storage: Storage, public navCntl: NavController) {
    this.shadowLoginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
    this.getInfo();
   }

  closeModal() {
    this.model.dismiss();
  }

  async getInfo(){
    await this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
        this.accessToken = res.accessToken;
        this.adminEmail = res.email;
      }
    })
  }

  async doLogin() {
   
    const adminToken = localStorage.getItem("token");
    await this.api.addTokenInHeader();

    const emailForm = {
        token:  this.accessToken,
        email: this.shadowLoginForm.value.email,
        userType:"user"
    }
    
    this.api.showLoader();

    this.api.shadowLogin(emailForm).subscribe(
      async (res: ApiResponse) => {
        // hide loader in success
        this.api.hideLoader();
        if (res.success === true) {

          // check token is received or user data received
          if (res.user && res.token) {
            this.authService.authState.next(true);
            localStorage.setItem("adminToken", adminToken);
            localStorage.setItem("adminAccessToken", this.accessToken);
            this.storage.set(PetcloudApiService.USERTOKEN, res.token);
            localStorage.setItem("token", res.token);
            localStorage.setItem("adminEmail",this.adminEmail);
            localStorage.setItem("notificationToken", res.notificationToken);

            this.events.publish("user", res.user);

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
                console.log("Response is saved", res);
              },
              (err) => {
                console.log("Error in storage", err);
              }
            );

            let user_type = await res.user.user_type;

            if (user_type == 3 || user_type == 2) {
              localStorage.setItem("menuType", "sitter")
              this.storage.set("menuType", "sitter").then((res) => {
                this.events.publish("menuName", {menuType:"sitter", time: Date.now()})
              })
            } else if (user_type == 1) {
              localStorage.setItem("menuType", "owner")
              this.storage.set("menuType", "owner").then((res) => {

              })
            }

            await this.api.addTokenInHeader();

            this.api.showToast("Login Success", 3000, "bottom");
            this.model.dismiss();
            

          }
        } else {
          this.api.showToast("Unable to login!", '3000', "bottom");
        }
      },
      async (err) => {
        this.api.showToast("Invalid Token!", 2000, "bottom");
        // hide loader in error
        this.api.hideLoader();
        
      }
    );
  }
}
