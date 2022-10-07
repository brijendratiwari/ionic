import {Component, OnInit} from '@angular/core';
import {PetcloudApiService} from './../../api/petcloud-api.service';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
// import model files
import {ApiResponse} from '../../model/api-response';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-profile-mobile-verify',
    templateUrl: './profile-mobile-verify.page.html',
    styleUrls: ['./profile-mobile-verify.page.scss'],
})
export class ProfileMobileVerifyPage implements OnInit {
    public verifyForm: FormGroup;

    constructor(protected storage: Storage, 
        public api: PetcloudApiService, 
        private formBuilder: FormBuilder, 
        protected router: Router,public navCtrl: NavController) {
    }

    ngOnInit() {
        this.verifyForm = this.formBuilder.group({
            mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
            verifyCode: ['', [Validators.required]]
        });

        this.storage.get(PetcloudApiService.USER)
            .then((data: any) => {
                // console.log(data);
                this.verifyForm.setValue({
                    mobileNumber: data.mobile,
                    verifyCode: ''
                });
            });
    }

    public verifyCodeForMobile() {
        console.log(this.verifyForm.value.verifyCode);
        if (this.verifyForm.value.verifyCode == '' || this.verifyForm.value.verifyCode == null) {
            this.api.showToast('please provide verification code first.', 2000, 'bottom');
        } else {
            this.api.showLoader();
            this.api.verifyCodeForMobile(this.verifyForm.value.verifyCode).pipe(
                finalize(() => {
                    this.api.hideLoader();
                }))
                .subscribe((res: ApiResponse) => {
                    if (res.success) {
                        this.api.showToast('Your Mobile number is verified successful.', 2000, 'bottom');
                    } else {
                        this.api.showToast('Your Mobile number is not verified! Try again.', 2000, 'bottom');
                    }
                }, (err: any) => {
                    console.log('verify code error', err);
                    this.api.showToast('Your Mobile number is not verified! Try again.', 2000, 'bottom');
                    this.api.autoLogout(err,this.verifyForm.value.verifyCode)
                });
        }
    }

}
