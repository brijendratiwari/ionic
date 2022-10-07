import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { User } from '../model/user';
import { NavController, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-invite-friend',
    templateUrl: './invite-friend.page.html',
    styleUrls: ['./invite-friend.page.scss'],
})
export class InviteFriendPage implements OnInit {

    // initialize forms
    public referredFriends: FormGroup

    //Refer Link
    referLink: any;
    shareCoupon: any = "";

    constructor(private formBuilder: FormBuilder,
        public navCntl: NavController,
        public alertController: AlertController,
         public api: PetcloudApiService,
        public storage: Storage) {
        this.getInfo();
    }

    ngOnInit() {
        this.referredFriends = this.formBuilder.group({
            referred_email: ['', [Validators.required, Validators.email]],
        });
    }

    inviteFriend() {
        const referredFriends = {
            'ReferredFriends': {
                referred_email: this.referredFriends.value.referred_email,
            }
        };
    }

    async shareTwitter() {
        this.api.shareViaTwitter('If you love pets, why not sign up to PetCloud, you can either become a Pet Sitter or book a Pet Sitter! Click here to find out more info:' + this.referLink,null,null);
    }

    async shareFacebook() {
        this.api.shareViaFb('If you love pets, why not sign up to PetCloud, you can either become a Pet Sitter or book a Pet Sitter! Click here to find out more info:' + this.referLink,null,null);
    }

    /**
     * submit to refer and invite friend in petcloud
     */
    public refferInviteFriend() {
        this.api.showLoader();
        this.api.inviteFriend(this.referredFriends.value)
            .pipe(finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res.success) {
                    this.api.showToast('Referral Sent', 2000, 'bottom');
                } else {
                    this.api.showToast('This email address has already been referred', 2000, 'bottom');
                }
            }, err => {
                this.api.autoLogout(err, this.referredFriends.value);
            });
    }



    getInfo() {
        this.storage.get(PetcloudApiService.USER)
            .then((userData: User) => {
                this.referLink = userData.share_url;
                this.shareCoupon = userData.share_coupon;
                console.log("ReferLink", this.referLink);
            });
    }

    shareMessenger() {
        this.api.shareVia("com.facebook.orca","Messenger",'If you love pets, why not sign up to PetCloud, you can either become a Pet Sitter or book a Pet Sitter! Click here to find out more info:' + this.referLink,null,null, null)
    }

    /**
     * copy to clipboard
     */
    public copyUrl(url: any) {
        console.log(url)
       this.api.shareViaClipBoard(url);
    } 
}

