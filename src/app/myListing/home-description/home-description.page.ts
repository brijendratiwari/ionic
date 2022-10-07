import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

// importing model files
import { Space } from '../../model/space';
import { ApiResponse } from '../../model/api-response';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { User } from '../../../../src/app/model/user';

@Component({
    selector: 'app-home-description',
    templateUrl: './home-description.page.html',
    styleUrls: ['./home-description.page.scss'],
})
export class HomeDescriptionPage implements OnInit {

    public homeDescriptionFrm: FormGroup;

    constructor(public api: PetcloudApiService, 
        private formBuilder: FormBuilder, protected router: Router, 
        protected storage: Storage,
        public navcntl: NavController) {
    }

    ngOnInit() {
        this.homeDescriptionFrm = this.formBuilder.group({
            description: ['', [Validators.required]],
            property_type: ['', [Validators.required]],
            backyard_type: ['', [Validators.required]],
            backyard_size: ['', [Validators.required]],
            secure: [true],
            fence_size: ['', [Validators.required]],
            vet_distance: [''],
            children_location: [false],
            allergies: [false],
            parvo: [false],
            council_regulations: [false],
            other_animals: [false],
            other_animals_desc: [''],
            pet_count: 0
        });
    }

    ionViewDidEnter() {
        // fetch listing of home descriptrions data.
        this.storage.get(PetcloudApiService.USER)
            .then((userData: any) => {
                if (userData !== null && userData.space !== null) {
                    this.getListingHomeDescription();
                }
            });
    }

    public saveListingHomeDescription() {
        this.api.showLoader();
        this.api.saveListingHomeDescription(this.homeDescriptionFrm.value, localStorage.getItem('spaceId'))
            .pipe(finalize(() => {
                this.api.hideLoader();
            })).subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                
                   
                    this.storage.set(PetcloudApiService.USER, res.user);
                    this.api.showToast('Home description updated successfully.', 2000, 'bottom');
                    this.navcntl.pop();
                } else {
                    this.api.showToast('Home description not updated! Try again.', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.autoLogout(err,this.homeDescriptionFrm.value);
            });
    }

    // get Home Descriptions
    public getListingHomeDescription() {
        this.api.showLoader();
        this.api.getListingInfo()
            .subscribe((res: ApiResponse) => {
                let homeDesc: any = res.user.space;
                // store space id in local storage
                localStorage.setItem('spaceId', homeDesc.id);
                homeDesc.allergies = (homeDesc.allergies != null && homeDesc.allergies === '1') ? true : false;
                homeDesc.parvo = (homeDesc.parvo != null && homeDesc.parvo === '1') ? true : false;
                homeDesc.council_regulations = (homeDesc.council_regulations != null && homeDesc.council_regulations === '1') ? true : false;
                homeDesc.other_animals = (homeDesc.other_animals != null && homeDesc.other_animals === '1') ? true : false;
                homeDesc.secure = (homeDesc.secure != null && homeDesc.secure === 'Y') ? true : false;
                homeDesc.children_location = (homeDesc.children_location != null && homeDesc.children_location === 'Y') ? true : false;
                this.api.hideLoader();
                if (res.success) {
                    this.homeDescriptionFrm.setValue({
                        description: homeDesc.description,
                        property_type: homeDesc.property_type,
                        backyard_type: String(homeDesc.backyard_type),
                        backyard_size: homeDesc.backyard_size,
                        secure: homeDesc.secure,
                        fence_size: homeDesc.fence_size,
                        vet_distance: homeDesc.vet_distance,
                        children_location: homeDesc.children_location,
                        allergies: homeDesc.allergies,
                        parvo: homeDesc.parvo,
                        council_regulations: homeDesc.council_regulations,
                        other_animals: homeDesc.other_animals,
                        other_animals_desc: homeDesc.other_animals_desc,
                        pet_count: homeDesc.pet_count
                    });
                }
            }, (err: any) => {
                this.api.hideLoader();
                console.log('error in get home description', err);
                this.api.showToast('Home description not found! Try again.', 2000, 'bottom');
            });
    }

}
