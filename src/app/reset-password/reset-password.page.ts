import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {PetcloudApiService} from '../api/petcloud-api.service';
import {Router} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';
import {MenuController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
// imprt model files
import {ApiResponse} from '../model/api-response';
import {finalize} from 'rxjs/operators';


@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

    // main form for reset password
    public resetForm: FormGroup;
    public resetData: {
        email: ''
    };

    constructor(public api: PetcloudApiService, private formBuilder: FormBuilder,
                protected router: Router, public loader: LoadingController,
                public sideMenu: MenuController,
                public storage: Storage,
                public navCtrl: NavController) {
        // disable side menu on reset password page
        this.sideMenu.enable(false);
    }

    ngOnInit() {
        this.resetForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    public resetPassword() {
        this.api.showLoader();
        this.resetData = this.resetForm.value;
        this.api.resetPassword(this.resetData).pipe(finalize(() => {
            // hide loader in success
            this.api.hideLoader();
        })).subscribe((res: ApiResponse) => {
            if (res.success) {
                this.api.showAlert('Reset Password', 'An email has been sent to <b>' + this.resetData.email + '</b>. Click on the link in the email to reset your password', [
                    {
                        text: 'OK',
                        handler: () => {
                            this.router.navigateByUrl('/login');
                        }
                    }
                ]);
            } else {
                this.api.showToast('Link is not send to your Email! Try again.', 2000, 'bottom');
            }
        }, (err: any) => {
            this.api.showToast('something went wrong! please Try again.', 2000, 'bottom');
            this.api.autoLogout(err,this.resetData);
        });
    }

}
