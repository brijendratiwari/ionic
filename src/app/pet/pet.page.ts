import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-pet',
    templateUrl: './pet.page.html',
    styleUrls: ['./pet.page.scss'],
})
export class PetPage implements OnInit {

    public isPetAvailable: boolean = false;
    public petList: any = [];
    isAPILoaded: boolean = false;

    constructor(public api: PetcloudApiService, protected storage: Storage,
         protected router: Router,public navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        // fetch pet listings
        this.getPetsListing();
    }

    /**
     * Get Pet List
     */
    public  getPetsListing() {
        this.api.showLoader();
        this.storage.get(PetcloudApiService.USER)
            .then((userData: User) => {
                console.log(userData);
                this.api.getPetList(userData.id).pipe(
                    finalize(() => {
                        this.api.hideLoader();
                    }))
                    .subscribe((res: any) => {
                        this.isAPILoaded = true;
                        if (res.success) {
                            if (res.pets.length > 0) {
                                this.isPetAvailable = true;
                                this.petList = res.pets; // assign list object to local variable.
                            } else {
                                this.isPetAvailable = false;
                            }
                        } else {
                            this.api.showToast('No pet found! add new family member', 200, 'bottom');
                        }
                    }, (err: any) => {
                        this.api.hideLoader();
                        this.api.showToast('No pet found! add new family member', 2000, 'bottom');
                          this.api.autoLogout(err,userData.id)
                    });
            }, (err: any) => {
                this.isAPILoaded = true;
                // this.api.autoLogout(err)
            });
    }

    /**
     * Delete Pet
     */
    public deletePet(petId: any, petObj: any,index) {
        this.api.showAlert('Delete', 'Are you sure to delete this pet?', [
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
                    this.api.showLoader();
                    // code for delete pets.
                    this.api.deletePet(petId).pipe(
                        finalize(() => {
                            this.api.hideLoader();
                        }))
                        .subscribe((res: any) => {
                            if (res.success) {
                                for (let i = 0; i < this.petList.length; i++) {
                                    if (this.petList[i] == petObj) {
                                        this.petList.splice(i, 1);
                                    }
                                }
                                
                                if(!this.petList.length){
                                    this.isPetAvailable = false;
                                }
                            }else{
                                this.api.showToast(res.error, 200, 'bottom');
                            }
                        }, (err: any) => {
                            this.api.showToast('Pet not deleted.', 200, 'bottom');
                            this.api.autoLogout(err,petId)
                        });
                }

            }
        ]);
    }

    needSupport(){
        this.api.openExteralLinks(this.api.FRESHDESK_WEB)
    }

}
