import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
 import { Storage } from '@ionic/storage';
import { User } from '../model/user';
import { PetcloudApiService } from '../api/petcloud-api.service';



@Component({
  selector: 'app-feedback-email-form',
  templateUrl: './feedback-email-form.component.html',
  styleUrls: ['./feedback-email-form.component.scss'],
})

export class FeedbackEmailFormComponent implements OnInit {

  public apiService: any; 
  public feedbackForm: FormGroup;
  public fromEmail: any = ""
  public to : any = ""
  public cc : any = ""
  public subject: any =""
  public body: any = ""
  constructor(
     public navParam:NavParams,
     public storage: Storage,
     public model:ModalController,
     public injector:Injector,
    private formBuilder: FormBuilder) { 
      
      this.apiService =   this.injector.get(PetcloudApiService);

      this.to = this.navParam.get("to")
      this.cc = this.navParam.get("cc")
      this.subject = this.navParam.get("subject")
      this.body = this.navParam.get("body")
      
      console.log("Email Data", this.to,  this.cc, this.subject, this.body);
    }

   ngOnInit() {
    
    console.log("user", localStorage.getItem(""))
    this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      this.fromEmail = await res.email;
    })

    this.feedbackForm = this.formBuilder.group({
      email: [""],
      to:["", [Validators.required, Validators.email]],
      subject:[this.subject],
      description:[this.body,[Validators.required]]
    });

      this.feedbackForm.patchValue({
        email:this.fromEmail,
        to:this.to
      })
 }

 
  closeModal() {
     this.model.dismiss();
  }

  sendEmail(){
    this.apiService.showLoader();
    const emailForm = {
      email:this.fromEmail,
      subject:this.feedbackForm.value.subject,
      to:this.to,
      cc:this.cc,
      description:this.feedbackForm.value.description
    }
    this.apiService.sendFeedbackEmail(emailForm).pipe(finalize(() => {
      this.apiService.hideLoader();})).subscribe(
    (res: any) => {
      if(res.status){
        this.apiService.showToast(res.message,"3000","bottom");
        this.closeModal();
      }else{
        this.apiService.showToast(res.message,"3000","bottom");
      }
    },err=>{
      this.apiService.autoLogout(err,"");
    })
   }
}
