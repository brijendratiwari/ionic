import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-map-filter',
    templateUrl: './map-filter.page.html',
    styleUrls: ['./map-filter.page.scss'],
})
export class MapFilterPage implements OnInit {

    public selectedFilter: any = {
        serviceTypeId: 0,
        dropOff: '',
        pickUp: '',
        spacesPet: '',
        samePetType: 0,
        breed: [],
        distance: 5,
        ratepernight: { lower: 5, upper: 100 },
        property_type: '',
        backyard_type: '',
        hostSkills: '',
        hostAttributes: ''
    };

    public primaryService = [];
    public petBreedList = [];
    public breedListInterfaceOption = {
        header: 'Select pet breed'
    };

    constructor(public modalCtrl: ModalController,
        protected storage: Storage,
        public api: PetcloudApiService) {
        this.getAllService();
        this.getPetBreedList();
    }

    ngOnInit() {
    }

    public dismissModal() {
        this.modalCtrl.dismiss();
    }

    public setFilter(key, val) {
        this.selectedFilter[key] = val;
    }

    public getPetBreedList() {
        this.api.getAllPetBreed()
            .subscribe((res: any) => {
                this.petBreedList = res;
            }, (err: any) => {
                this.api.autoLogout(err,"")
            });
    }

    public getAllService() {
        this.api.showLoader();
        this.api.getAllService().pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe((res: any) => {
            // if (res.success) {
            this.primaryService = res.primary;
            let iconCount = 1;
            for (let i = 0; i < this.primaryService.length; i++) {
                this.primaryService[i]['serviceIcon'] = 'filter_b_' + iconCount + '.svg';
                iconCount++;
            }
        }, (err: any) => {
            this.api.showToast('service not found! please try again', 2000, 'bottom');
        });
    }

    public applyFilter() {
        this.modalCtrl.dismiss(this.selectedFilter);
    }
}
