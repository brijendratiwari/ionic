import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { NavController, ActionSheetController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';

// import model file
import { Pet } from '../model/pet';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { SocailshareComponent } from '../socailshare/socailshare.component';
import { ViewImageModelComponent } from '../view-image-model/view-image-model.component';

@Component({
    selector: 'app-pet-view',
    templateUrl: './pet-view.page.html',
    styleUrls: ['./pet-view.page.scss'],
})
export class PetViewPage implements OnInit {

    public selectedPetId: any = 0;
    public petData: Pet; // initialize pet model into local variable
    public selectedSegment = '';
    public habitStr = '';
    public years_old = "";
    public socialShareLink = '';
    public insurance_cover:  any = {}
    public insuranceImage = ''
    public vaccinationRecordImage: string = "" 
    public emergency_contactsblvet: any = {};
    public vaccinationAlert: ""
    public emergency_contactsblcontact:any = {};

    public other_medications : any = "";
    
    
    
    constructor(protected activeRoute: ActivatedRoute,
        public api: PetcloudApiService,
        public modelCtrl: ModalController,
        public actionSheetCtrl: ActionSheetController,
        public modalCtrl:ModalController,
        public camera: Camera,
        protected router: Router, protected navCtrl: NavController, protected storage: Storage) {
        this.selectedPetId = this.activeRoute.snapshot.paramMap.get('petId');
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.getPet(this.selectedPetId);
    }

    /**
     * Get Pet details
     * @param petId pass pet id
     */
    public getPet(petId: any) {
        //  this.api.showLoader();
        this.api.getPet(petId).pipe(
            finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe(async (res: any) => {
                this.petData = await res.pet;

                let insurancecover = await res.pet.insurance_cover;
                let emergency_contactsbl = await res.pet.emergency_contactsbl;
                let other_medication = await res.pet.other_medications;
                let vaccinationAlert = await res.pet.vaccinationsbl;
                
                if(vaccinationAlert){
                    if(res.pet.vaccinationsbl.length >= 3){
                        if(res.pet.vaccinationsbl[3]){
                            this.vaccinationAlert = await res.pet.vaccinationsbl[3].date;
                        }
                    }
                }

                if(emergency_contactsbl){
                    if(res.pet.emergency_contactsbl.emergency_contactsbl){
                        this.emergency_contactsblvet = res.pet.emergency_contactsbl.emergency_contactsbl.vet;
                        this.emergency_contactsblcontact = res.pet.emergency_contactsbl.emergency_contactsbl.contact;

                    }
                }
               
                if(insurancecover != null){
                    if(insurancecover.insurance){
                        this.insurance_cover = insurancecover.insurance;
                        let insurancename = insurancecover.insurance.name
                        let insuranceamt = insurancecover.insurance.amount
                        if(insurancename != "" || insuranceamt != ""){
                            this.getInsuranceImage();
                        }
                    }
                }

                if(other_medication){
                    if(other_medication.length){
                        this.other_medications = other_medication[0]
                        console.log("other med", this.other_medications);
                    }
                }

                let monthsOld = moment().diff(moment(this.petData.dob, 'YYYY-MM-DD'), 'months');
                if (monthsOld >= 12) {
                    this.years_old = (moment().diff(moment(this.petData.dob, 'YYYY-MM-DD'), 'months') / 12).toFixed(0).concat(monthsOld == 12 ? " Year Old" : " Years Old")
                } else {

                    this.years_old = (moment().diff(moment(this.petData.dob, 'YYYY-MM-DD'), 'months')).toFixed(0).concat(monthsOld == 1 ? " Month Old" : " Months Old")
                }


                this.socialShareLink = res.pet.share_url;
                this.selectedSegment = 'identity';
            }, (err: any) => {
                this.api.showToast('Pet not found please go back and Try again!', 2000, 'bottom');
                this.api.autoLogout(err, petId)
            });
    }

    

    getInsuranceImage(){
        this.api.getInsurancePolicy(this.selectedPetId).subscribe(
            (res: any) => {
                if (res.status) {
                    if (res.image) {
                        this.insuranceImage = res.image;
                    } else {
                        this.insuranceImage = ""
                    }
                } else {
                    this.insuranceImage = ""
                }
            },
            (err) => {
            }
        );
    }

    public getUploadedVaccinationRecord() {
        this.api.getUploadedVaccinationRecord(this.selectedPetId).subscribe(
            (res: any) => {
                if (res.status) {
                    this.vaccinationRecordImage = res.image;
                }
            },
            (err) => {
                this.api.autoLogout(err, this.selectedPetId);
            }
        );
    }
    

    public async viewImageModel(image) {
    
        const modal = await this.modalCtrl.create({
            component: ViewImageModelComponent,
            animated: true,
            componentProps: {
                image
            },
        });
        modal.onDidDismiss().then((data: any) => {

        });
        return await modal.present();
    }

    public gotoupdatePet(petId: any) {
        this.navCtrl.navigateForward(['pet-update'], petId);
    }

  
    public getMedicationFreq(freq) {
        switch(freq){
            case 0: 
                return "Every Week"

            case 1:
                return "Every 2nd Week"

            case 2:
                return "Every Month"

            case 3:
                return "Every 3 Months"

            case 4:
                return "Every 6 Months"

            case 5:
                return "Every Year"

            case 6:
                return "Once Off"
        }
    }

    public grommingFrequency(freq){

            console.log("freq", freq)
        switch (freq) {
            case 0:
                return 'Weekly';
             
            case 1:
                return 'Fortnightly';
            case 2:
                return 'Monthy';
            case 3:
                return 'Quarterly';
            case 4:
                return 'Half-yearly';
            case 5:
                return 'Yearly';
            case 6:
                return 'Once Off';
            default:
                return 'Not specified';
        }
    }


    public getHabits(habitId: any) {
        switch (habitId) {
            case '1':
                return 'Escapism';
                break;
            case '2':
                return 'Digging holes';
                break;
            case '3':
                return 'Destructive behaviour';
                break;
            case '4':
                return 'Barking/meowing/calling';
                break;
            case '5':
                return 'Growling';
                break;
            case '6':
                return 'Health Issues';
                break;
            default:
                return 'Not specified';
        }
    }

    public getChildStay(stayId: any) {
        switch (stayId) {
            case 1:
                return 'Fine with children over age 2';
                break;
            case 2:
                return 'Fine with children over age 5';
                break;
            case 3:
                return 'Fine with children over age 8';
                break;
            case 4:
                return 'Fine with children over age 10';
                break;
            case 5:
                return 'Fine with children all ages';
                break;
            case 6:
                return 'Not ok with children';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetSleep(sleepId: any) {
        switch (sleepId) {
            case 1:
                return 'Own bed in bedroom';
                break;
            case 2:
                return 'Lounge/Family room';
                break;
            case 3:
                return 'Other part of house';
                break;
            case 4:
                return 'Laundry/Garage/Patio/Other';
                break;
            case 5:
                return 'Outside';
                break;
            case 6:
                return 'Stables';
                break;
            case 7:
                return 'On my bed';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetalone(aloneId: any) {
        switch (aloneId) {
            case 1:
                return '1 to 4 hours';
                break;
            case 2:
                return '4 to 8 hours';
                break;
            case 3:
                return '8 to 12 hours';
                break;
            case 4:
                return 'Daily';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetReact(reactId: any) {
        switch (reactId) {
            case 1:
                return 'Unsettled but Ok';
                break;
            case 2:
                return 'Terrified';
                break;
            case 3:
                return 'May try to escape';
                break;
            case 4:
                return 'No Problem at all';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetWeight(weight: any) {
        switch (weight) {
            case 1:
                return '10Kg (small)';
                break;
            case 2:
                return '11-25Kg (medium)';
                break;
            case 3:
                return '26-40Kg (large)';
                break;
            case 4:
                return '>41Kg (Very large)';
                break;
            case 5:
                return 'Daily';
                break;
            default:
                return 'Not specified';
            
        }
    }

    public getPetWalkTime(time: any) {

        switch (time) {
            case 1:
                return "Early Morning"
                break;

            case 2:
                return "Late Afternoon"
                break;

            case 3:
                return "Twice a day"
                break;

            default:
                return "Not Specified"

        }
    }

    public sleepLocation(location: any) {
        switch (location) {
            case 0:
                return 'Laundry'
                    break
            case 1:
                return "Garage"
                    break
            case 2:
                return "Patio"
                    break
            case 3:
                return "Others"
                    break
            default:
                return "Not Specified"
        }
    }

    public getPetWalk(walkId: any) {
        switch (walkId) {
            case 1:
                return 'A couple of times a week';
                break;
            case 2:
                return 'Once a week';
                break;
            case 3:
                return 'Occasionally';
                break;
            case 4:
                return 'Never';
                break;
            case 5:
                return 'Daily';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetWalkBehave(walkBehaveId: any) {
        switch (walkBehaveId) {
            case 1:
                return 'Pulls at first and then settles down';
                break;
            case 2:
                return 'Needs a strong person to walk him/her';
                break;
            case 3:
                return 'Impossible to walk';
                break;
            default:
                return 'Not specified';
        }
    }

    public getPetFleas(fleasId: any) {
        switch (fleasId) {
            case 1:
                return 'Weekly';
                break;
            case 2:
                return 'Monthly';
                break;
            case 3:
                return 'Never';
                break;
            case 4:
                return 'No Problem';
                break;
            default:
                return 'Not specified';
        }
    }


    public async socialShare() {

        const modal = await this.modelCtrl.create({
            component: SocailshareComponent,
            animated: true,
            cssClass: 'modalCss',
            componentProps: {
                link: this.socialShareLink
            }
        })
        return await modal.present();
    }


}
