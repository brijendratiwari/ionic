import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.page.html',
    styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

    public selectedSegment = 'cp';
    // initialize forms
    public changePasswordForm: FormGroup;
    public CancelForm: FormGroup;
    changePasswordData: any;

    public cpData = {
        ChangePasswordForm: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        }
    };

    cancelAccountData: any = { reason: "", feedback: "", unsubscribe: "" };
    constructor(private formBuilder: FormBuilder, protected storage: Storage,
        public api: PetcloudApiService, public navcntl: NavController) {
    }

    ionViewDidEnter() {

    }

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            newPasswordConfirm: ['', [Validators.required]]
        });

        this.CancelForm = this.formBuilder.group({
            reason: ['', [Validators.required]],
            feedback: ['', [Validators.required]],
            unsubscribe: [true]
        });
    }

    public passwordConfirm(): boolean {
        if (this.changePasswordForm.get('newPassword').value !== this.changePasswordForm.get('newPasswordConfirm').value) {
            this.changePasswordForm.controls['newPasswordConfirm'].setErrors({ 'incorrect': true });
            return true;
        } else {
            return false;
        }
    }


    public changeUserPassword() {
        // show loading
        this.api.showLoader();
        this.cpData.ChangePasswordForm.currentPassword = this.changePasswordForm.value.currentPassword;
        this.cpData.ChangePasswordForm.newPassword = this.changePasswordForm.value.newPassword;
        this.cpData.ChangePasswordForm.newPasswordConfirm = this.changePasswordForm.value.newPasswordConfirm;

        this.api.changePassword(this.cpData)
            .pipe(finalize(() => {
                // hide loader in success
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res.success) {
                    this.api.showToast('Password Changed Successfully', 2000, 'bottom');
                } else {
                    this.api.showToast('Password not changed,try again!', 2000, 'bottom');
                }
            }, (err) => {
                // hide loader in error
                this.api.autoLogout(err,this.cpData);
            });
    }

    public cancelAccount() {

        if (this.CancelForm.value.unsubscribe == "") {
            this.CancelForm.value.unsubscribe = false;
        }
        this.api.showLoader();
        // Send Cancel Account Data Form to Server
        this.cancelAccountData.feedback = this.CancelForm.value.feedback;
        this.cancelAccountData.reason = this.CancelForm.value.reason;
        this.cancelAccountData.unsubscribe = this.CancelForm.value.unsubscribe;

        this.api.cancelAccount(this.cancelAccountData).pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe((res: any) => {
            if (res.success) {
                this.navcntl.navigateRoot('/login')
                this.api.showToast('Account Cancelled Successfully', 2000, 'bottom');
            } else {
                this.api.showToast('Account Not Cancelled!', 2000, 'bottom');
            }
        }, (err) => {
          this.api.autoLogout(err,this.cancelAccountData);
        });
    }    
}
