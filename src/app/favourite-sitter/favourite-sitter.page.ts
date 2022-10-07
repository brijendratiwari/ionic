import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { User } from '../model/user';
import { Storage } from '@ionic/storage'
import { Events } from '../events';

@Component({
    selector: 'app-favourite-sitter',
    templateUrl: './favourite-sitter.page.html',
    styleUrls: ['./favourite-sitter.page.scss'],
})
export class FavouriteSitterPage implements OnInit {

    public favSitters: any = [];
    public favSitter = { "minderid": "", "type": "" };
    userData: any;
    isFirstLoad: boolean = true;

    constructor(public api: PetcloudApiService,
        private storage: Storage, public navCtrl: NavController,
        public EPEvent: Events,) {
        this.getInfo();
        this.favSitter.type = "unfavourite";
        this.isFirstLoad = true;
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.favouriteSitterList();
    }

    public favouriteSitterList() {
        if(this.isFirstLoad) {
            this.api.showLoader();
            this.isFirstLoad = false;
        }
        this.api.getFavouriteSitter()
            .pipe(finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res) {
                    this.favSitters = res;
                    // if (res.length > 0) {
                    //     this.api.showToast('favourite sitters found successful!', 2000, 'bottom');
                    // }
                } else {
                    this.api.showToast('favourite sitters not found, Try again!', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.showToast('favourite sitters not found, Try again!', 2000, 'bottom');
            });
    }

    updateFaviourateUnfaviourate(minder) {
        this.api.showAlert('Delete', `Are you sure to remove ${minder.first_name} from favourite list?`, [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'danger',
                handler: (blah: any) => {
                    console.info('user canceled logout');
                }
            }, {
                text: 'Ok',
                handler: () => {
                this.favSitter.minderid = minder.id;
                this.api.sitterfavourite(this.favSitter)
                .pipe(
                    finalize(() => {
                        this.api.hideLoader();
                    })
                )
                .subscribe((res: any) => {
                    if (res.message == "Favourite") {
                        this.api.showToast('Successfully Marked as Favourite.', 2000, 'bottom');
                    } else if (res.message == "Unfavourite") {
                        this.api.showToast('Successfully Marked as Unfavourite.', 2000, 'bottom');
                    }
                    this.EPEvent.publish('isFaviourate', {status: true, time: Date.now()});
                    this.ionViewDidEnter();
                }, (err: any) => {
                this.api.autoLogout(err,this.favSitter);
                });
            }
        }])
    }

    getInfo() {
        this.storage.get(PetcloudApiService.USER)
            .then((res: User) => {
                this.userData = res;
            }, err => {
                
            });
    }



}
