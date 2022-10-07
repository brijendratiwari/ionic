import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { User } from '../model/user';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-why-join',
    templateUrl: './why-join.page.html',
    styleUrls: ['./why-join.page.scss'],
})
export class WhyJoinPage implements OnInit {

    public user_type: any = '';
    public checkUserType: boolean = false;

    constructor(protected storage: Storage, public api: PetcloudApiService,
        public navCtrl:NavController,
        protected router: Router) {
    }

    ngOnInit() {}

    public submitUserType() {
        if (this.user_type === '') {
            this.checkUserType = true;
        } else {
            this.api.showLoader();
            this.storage.get(PetcloudApiService.USER)
                .then((userData: User) => {
                    userData.user_type = this.user_type;
                    this.api.updateUserType(userData)
                        .pipe(finalize(() => {
                            this.api.hideLoader();
                        }))
                        .subscribe((res: any) => {
                            if (res.success) {
                                this.storage.set(PetcloudApiService.USER, res.user);
                                this.api.showToast('User updated!', 2000, 'bottom');
                                this.storage.get(PetcloudApiService.USER)
                                    .then((userRes: User) => {
                                    
                                        this.router.navigateByUrl('/basic-info');
                                    });
                            } else {
                                this.api.showToast('User not updated!', 2000, 'bottom');
                            }
                        }, (err: any) => {
                            this.api.autoLogout(err,userData)
                        });
                });
        }
    }
}
