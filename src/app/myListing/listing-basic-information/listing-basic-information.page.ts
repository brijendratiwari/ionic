import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {PetcloudApiService} from '../../api/petcloud-api.service';
import {Validators, FormBuilder, FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';

import {finalize} from 'rxjs/operators';
import {NavController, ModalController} from '@ionic/angular';
import { PolicyDetailComponent } from './policy-detail/policy-detail.component';
import { User } from '../../../app/model/user';


@Component({
    selector: 'app-listing-basic-information',
    templateUrl: './listing-basic-information.page.html',
    styleUrls: ['./listing-basic-information.page.scss'],
})
export class ListingBasicInformationPage implements OnInit {

    public basicListingFrm: FormGroup;
    public userFrm: FormGroup;
    public isPolicyDetail:boolean = false;

    constructor(public api: PetcloudApiService,
                private formBuilder: FormBuilder, protected router: Router,
                protected storage: Storage,public modalCtrl: ModalController,
                public navcntl: NavController) {
    }

    ngOnInit() {
        this.basicListingFrm = this.formBuilder.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required]],
            occupation: [''],
            emergency_car: [false, [Validators.required]], // emrgency vehicle
            last_minute: [false, [Validators.required]], // last miniute booking
            sits_dogs: [false],
            sits_cats: [false],
            sits_horses: [false],
            sits_misc: [false],
            cancellation_policy: [false],
            checkProfessional: [false],
            abn: [''],
            sendMeJobs: [''],
            gst_registered:[''],
            about_pet: [''],            
        });
    }

    ionViewDidEnter() {
        this.storage.get(PetcloudApiService.USER)
            .then((userData: any) => {
                if (userData !== null && userData.listing != null) {
                    this.getListingBasicInformation();
                }
            });
    }

    testFunction() {
        this.basicListingFrm.patchValue({
            name: this.setURL()
        });
    }

    public saveListingBasicInformation() {
        this.api.showLoader();
        const listing = this.basicListingFrm.value;
        listing.emergency_car = (listing.emergency_car === true) ? '1' : '0';
        listing.last_minute = (listing.last_minute === true) ? '1' : '0';
        listing.sits_dogs = (listing.sits_dogs === true) ? '1' : '0';
        listing.sits_cats = (listing.sits_cats === true) ? '1' : '0';
        listing.sits_horses = (listing.sits_horses === true) ? '1' : '0';
        listing.sits_misc = (listing.sits_misc === true) ? '1' : '0';
        listing.sendMeJobs = (listing.sendMeJobs === true) ? '1' : '0';
        listing.gst_registered = (listing.gst_registered === true) ? '1' : '0';
        listing.checkProfessional = (listing.checkProfessional === true) ? '1' : '0';
        const Users = {
            about_pet: listing.about_pet
        };
        const listingFrm = {
            'Listings': listing,
            'Users': Users
        };

        this.api.saveListingBasicInformation(listingFrm).pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe(
            (res: any) => {
                if (res.success) {
                    this.saveListingResponse(res.user);  
                } else {
                    this.api.showToast(res.error, 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.showToast('Listing is not updated', 2000, 'bottom');
                this.api.autoLogout(err,listingFrm);
            });
    }

    public saveListingResponse (userData){
        this.storage.set(PetcloudApiService.USER, userData); 
        this.api.showToast('Listing is updated', 2000, 'bottom');
       this.router.navigateByUrl('/listing')
    }

    public getListingBasicInformation() {
        this.api.showLoader();
        this.api.getListingInfo()
            .subscribe((res: any) => {
                if (res.success) {
                    let listing: any = res.user.listing;

                    if (res.user.listing != null) {
                        listing.emergency_car = (listing.emergency_car != null && listing.emergency_car === '1') ? true : false;
                        listing.last_minute = (listing.last_minute != null && listing.last_minute === '1') ? true : false;
                        listing.sits_dogs = (listing.sits_dogs != null && listing.sits_dogs === '1') ? true : false;
                        listing.sits_cats = (listing.sits_cats != null && listing.sits_cats === '1') ? true : false;
                        listing.sits_horses = (listing.sits_horses != null && listing.sits_horses === '1') ? true : false;
                        listing.sits_misc = (listing.sits_misc != null && listing.sits_misc === '1') ? true : false;
                        listing.sendMeJobs = (listing.sendMeJobs != null && listing.sendMeJobs === '1') ? true : false;
                        listing.gst_registered = (listing.gst_registered != null && listing.gst_registered === '1') ? true : false;;
                    }
                    this.api.hideLoader();
                    this.basicListingFrm.patchValue({
                        title: listing.title,
                        name: listing.name,
                        occupation: listing.occupation,
                        emergency_car: listing.emergency_car, // emrgency vehicle
                        last_minute: listing.last_minute, // last miniute booking
                        sits_dogs: listing.sits_dogs,
                        sits_cats: listing.sits_cats,
                        sits_horses: listing.sits_horses,
                        sits_misc: listing.sits_misc,
                        cancellation_policy: listing.cancellation_policy,
                        checkProfessional: (listing.abn.length > 0) ? true : false,
                        abn: listing.abn,
                        sendMeJobs: listing.sendMeJobs,
                        gst_registered: listing.gst_registered,
                        about_pet: res.user.about_pet,
                    });
                }
            }, (err: any) => {
                this.api.hideLoader();
                this.api.showToast('Listing details not found! Try again.', 2000, 'bottom');
                this.api.autoLogout(err,"");
            });
    }

    public setURL() {
        let str = this.basicListingFrm.get('title').value;
        str = str.split(' ').join('-');
        return str;
    }
    public async refundPolicy(){
        const modal = await this.modalCtrl.create({
            component: PolicyDetailComponent,
            animated: true
        });
        modal.onDidDismiss()
            .then((data: any) => {
            });
        return await modal.present();
    }

}
