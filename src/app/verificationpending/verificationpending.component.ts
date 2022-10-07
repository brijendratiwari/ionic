import { Component, Injector, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { User } from '../model/user';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-verificationpending',
  templateUrl: './verificationpending.component.html',
  styleUrls: ['./verificationpending.component.scss'],
})
export class VerificationpendingComponent implements OnInit {
  public apiService:any
  
  message: any;
  public VERIFIED = "Verified";
  
  constructor(public modal: ModalController,
    public storage: Storage,
    public injector: Injector,
    public alertController: AlertController,   public model:ModalController,
    public navCntl: NavController) { 
      this.apiService =   this.injector.get(PetcloudApiService);
      console.log("API SERV", this.apiService);
    }

  ngOnInit() {
    this.getInfo();
  }

  closeModal(){
    this.modal.dismiss()
  }

  async sendFollowUpEmail(){
    this.closeModal()

    this.apiService.sendEmailtoAccounts("service@petcloud.com.au","","Follow up for verifications.","")
  }

  doVerification(){
    this.closeModal()
    this.navCntl.navigateRoot('/profile-email-verify')
  }

  getInfo(){
    this.storage.get(PetcloudApiService.USER)
    .then(async (res: User) => {

      console.log("Verified", res);
           // PHONE AND EMAIL VERIFY PENDING
          if(res.verified == 0 && res.verify_phoneflag == "N"){
            this.message = "Your email verification and phone verification is Pending." 
          }
          
          // EMAIL VERIFY PENDING
          else if(res.verified == 0){
            this.message = "Your email verification is pending please complete email verification." 
          }

          // PHONE VERIFY PENDING
          else if(res.verify_phoneflag == "N"){
              this.message = "Your mobile number verification is pending please complete mobile number verification." 
          }
          else if(res.user_type == 2 || res.user_type == 3) {
          // BACKGROUND VERIFICATION IS PENDING AND DOCUMENT IS NOT UPLOADED
          if(res.BackgroundCheck['is_verified'] != this.VERIFIED && 
            res.BackgroundCheck['document'] == null || ""  ){
              this.message = "Your background verification is pending. please complete background verification" 
          }

          // BACKGROUND VERIFICATION IS PENDING AND DOCUMENT IS UPLOADED
          else if(res.BackgroundCheck['is_verified'] != this.VERIFIED && 
            res.BackgroundCheck['document'] != null) {
            if(!res.multipleBooked){
              this.message = "Thank you so much for uploading verification documents. " +
              "We are working on this now. " +
            "We will update you as soon as we have verified it" 
            }
          else{
              this.modal.dismiss();
            }
          }
        }else{
          this.modal.dismiss();
        }
      })
    }
  }
    