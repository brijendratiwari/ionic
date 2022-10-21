import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { User } from '../model/user';
import { ApiResponse } from '../model/api-response';

@Component({
    selector: 'app-reference',
    templateUrl: './reference.page.html',
    styleUrls: ['./reference.page.scss'],
})
export class ReferencePage implements OnInit {

    public RequestTestimonialForm: FormGroup;
    emailArray: any = [];
    submitted = false;

    constructor(public modalCtrl: ModalController,
        private formBuilder: FormBuilder,
        public navCtrl: NavController,
        public api: PetcloudApiService,
        protected storage: Storage) {
    }

    ngOnInit() {
        this.RequestTestimonialForm = this.formBuilder.group({
            emails: ['', [Validators.required, Validators.email]],
            emailbody: ['Thanks a lot for completing a reference for me on petcloud.com.au. This will improve my profile',
                [Validators.required]]
        });
    }

    async shareFacebook() {
   
        this.api.shareViaFb(this.RequestTestimonialForm.value.emailbody,"",'https://www.petcloud.com.au/reference/create/13950393?fbclid=IwAR14NB2GfcBD1Y8c9rtiCVJLP07pZx1QnveWwdhjcOwbecSO_nN68aSrWAY',)
    }

    sendRequestReference() {
        this.submitted  = true;
        if (this.RequestTestimonialForm.valid) {
            this.emailArray.push(this.RequestTestimonialForm.value.emails);
          
            const reqFormArray = { emails: JSON.stringify(this.emailArray), emailbody: this.RequestTestimonialForm.value.emailbody };
            this.api.showLoader();
            this.api.requestReference(reqFormArray).pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe((res: any) => {
                if (res.success) {
                    this.RequestTestimonialForm.patchValue({
                        emails:''
                    })
                    
                    this.api.showToast('Email Sent', '2000', 'bottom');
                    // Patch Value is for clearing Email form
                    this.RequestTestimonialForm.patchValue({ emails: '' });
                    this.storage.get(PetcloudApiService.USER)
                        .then((userData: User) => {
                            userData.reference_flag = true;
                            this.api.updateUserProfile(userData)
                                .subscribe((resUserData: ApiResponse) => {
                                    if (resUserData.success) {
                                        this.storage.set(PetcloudApiService.USER, resUserData.user);
                                        this.storage.get(PetcloudApiService.USER)
                                            .then((UpuserData: User) => {
                                                
                                            });
                                    }
                                }, (err: any) => {
                                    this.api.autoLogout(err,reqFormArray)
                                });
                        });

                } else {
                    this.RequestTestimonialForm.patchValue({
                        emails:''
                    })
                    
                    this.api.showToast('Try Again', '2000', 'bottom');
                }
            }, err => {
                
            });
        } else {
            this.RequestTestimonialForm.get('emails').markAsTouched();
        
            return;
        }
    }

}
