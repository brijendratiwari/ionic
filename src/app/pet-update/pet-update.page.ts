import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Router } from "@angular/router";
import { NavController, Platform, ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ActivatedRoute } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { finalize } from "rxjs/operators";
import { AddVacinationComponent } from "../add-vacination/add-vacination.component";
import { CameraService } from "../camera-service.service";
import { Camera } from "@ionic-native/camera/ngx";
import * as moment from "moment";
import { VaccinationExplainationComponent } from "../vaccination-explaination/vaccination-explaination.component";
import { ViewImageModelComponent } from "../view-image-model/view-image-model.component";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-pet-update",
    templateUrl: "./pet-update.page.html",
    styleUrls: ["./pet-update.page.scss"],
})
export class PetUpdatePage implements OnInit {

    lastImage: string = null;
    public todayDate :string = "";
    public selectedPetImage = "";
    public selectedPetId: any = 0;
    public petForm: FormGroup;
    currnetDt: any;
    public vaccinationRecordImage = ""
    public petType: any = "";
    public petChildrenStaySelectoption: any = {
        header: "Fine to stay with children?",
        translucent: true,
    };
    public isVaccineRecordUploaded: boolean = false;
    public fileURLVaccine: string = "";
    public newPetid = 0; // store new added pet id for update
    public selectedSegment = "";
    public healthAlerts: any = [];
    public activeCard = [];

    public suppliments = [{
        value: "Glucosamine - joints",
    }, {
        value: "Fish Oil - Coat/Skin"
    }, {
        value: "Anxiety related"
    }, {
        value: "Probiotics - digestion"
    }, {
        value: "Antioxidants"
    }, {
        value: "Other"
    }]

    public food_considerations = [{
        label: "Digestive sensitivity",
        value: 0

    }, {
        label: "Coughing up fur balls",
        value: 1
    }, {
        label: "Has little to no teeth, so needs soft food",
        value: 2
    }, {
        label: "Skin irritation and itching",
        value: 3
    }, {
        label: "Needs to lose weight",
        value: 4
    }, {
        label: "High energy working dog",
        value: 5
    }, {
        label: "Growing Puppy",
        value: 6
    }, {
        label: "Adult",
        value: 7
    }, {
        label: "Senior",
        value: 8
    }, {
        label: "Pregnant",
        value: 9
    }]

    public bone_problems = [
        {
            label: "Have arthritis",
            value: "Have arthritis",
            isChecked: false
        }, {
            label: "Has hip dysplasia",
            value: "Has hip dysplasia",
            isChecked: false
        }]

    public petSleepLocation = [{
        label: "Own bed in bedroom",
        value: 1,
    }, {
        label: "Lounge/Family room",
        value: 2,
    }, {
        label: "Other part of house",
        value: 3,
    }, {
        label: "Laundry/Garage/Patio/Other",
        value: 4,
    }, {
        label: "Outside",
        value: 5,
    }, {
        label: "Stables",
        value: 6,
    }, {
        label: "On my bed",
        value: 7,
    }]

    public frequency = [{
        label: "Weekly",
        value: 0
    }, {
        label: "Fortnightly",
        value: 1
    }, {
        label: "Monthy",
        value: 2
    }, {
        label: "Quarterly",
        value: 3
    }, {
        label: "Half-yearly",
        value: 4
    }, {
        label: "Yearly",
        value: 5
    }, {
        label: "Once Off",
        value: 6
    }]
    public exericeFreq = [{
        value: 0,
        label: "Daily"
    }, {
        value: 1,
        label: "A couple of times a week"
    }, {
        value: 2,
        label: "Once a week"
    }, {
        value: 3,
        label: "Occasionally"
    }, {
        value: 4,
        label: "Never"
    }]

    public exerciseTime = [{
        value: "Early Morning"
    }, {
        value: "Late Afternoon"
    }, {
        value: "Twice a day"
    }]

    public feaFrequency = [{
        label: "Every Week",
        value: 0
    }, {
        label: "Every 2nd Week",
        value: 1
    }, {
        label: "Every Month",
        value: 2
    }, {
        label: "Every 3 Months",
        value: 3
    }, {
        label: "Every 6 Months",
        value: 4
    }, {
        label: "Every Year",
        value: 5
    }, {
        label: "Once Off",
        value: 6
    }]

    public walkKms = Array.from({ length: 10 }, (_, i) => i + 1)


    public coreVaccination1 = [
        {
            id: 1,
            vaccinationName: "C3",
            stage: "6 to 8 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: "reminder"
        }, {
            id: 2,
            vaccinationName: "C3 (C4 or C5 can be given in its place if the vet recommends it)",
            stage: "10 to 12 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: "reminder"
        }, {
            id: 3,
            vaccinationName: "C3",
            stage: "14 to 16 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: "reminder"
        }, {
            id: 4,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "5 Month old",
            dueOrComplete: null,
            action: true,
            actionType: "reminder"
        }, {
            id: 5,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "Every 1-3 years",
            dueOrComplete: "Every 3 years",
            action: false,
            actionType: "",
        }]


    public coreVaccination = [];
    // For PetType = 1;
    public coreVaccinationType1 = [
        {
            id: 1,
            vaccinationName: "C3",
            stage: "6 to 8 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 2,
            vaccinationName: "C3 (C4 or C5 can be given in its place if the vet recommends it)",
            stage: "10 to 12 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 3,
            vaccinationName: "C3",
            stage: "14 to 16 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 4,
            vaccinationName: "C3 Booster",
            stage: "15 months old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 5,
            vaccinationName: "C3 Booster",
            stage: "Every 3 years",
            dueOrComplete: "Every 3 years",
            action: false,
            actionType: true,
            disabled: false
        }]

    // For PetType = 2
    public coreVaccinationType2 = [
        {
            id: 1,
            vaccinationName: "FIV",
            stage: "6 to 8 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 2,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "10 to 12 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 3,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "14 to 16 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 4,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "5 Month old",
            dueOrComplete: null,
            action: true,
            actionType:true,
            disabled: false
        }, {
            id: 5,
            vaccinationName: "FIV, (Leukaemia, Chlamydia)",
            stage: "Every 1-3 years",
            dueOrComplete: "Every 3 years",
            action: false,
            actionType: true,
            disabled: false
        }]

    // For PetType = 3;
    public coreVaccinationType3 = [
        {
            id: 1,
            vaccinationName: "Equivac 2 in 1",
            stage: "12 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 2,
            vaccinationName: "Equivac S",
            stage: "14 weeks old",
            dueOrComplete: null,
            action: true,
            actionType:true,
            disabled: false
        }, {
            id: 3,
            vaccinationName: "Equivac 2 in 1",
            stage: "16 weeks old",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 4,
            vaccinationName: "Duvaxyn(EHV)r",
            stage: "Every 6 Months",
            dueOrComplete: null,
            action: true,
            actionType: true,
            disabled: false
        }, {
            id: 5,
            vaccinationName: "Duvaxyn(EHV)Booster",
            stage: "Every 6 Months",
            dueOrComplete: "Every 3 years",
            action: false,
            actionType: true,
            disabled: false
        }]


    constructor(
        public actionSheetCtrl: ActionSheetController,
        public platform: Platform,
        protected activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        public modalCtrl: ModalController,
        public api: PetcloudApiService,
        protected router: Router,
        protected navCtrl: NavController,
        protected storage: Storage,
        public cameraAPI: CameraService,
        public camera: Camera,
    ) {
        this.selectedPetId = this.activeRoute.snapshot.paramMap.get("petid");
        this.currnetDt = new Date().toISOString();
        this.todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
        console.log("today date", this.todayDate);
    }


    ngOnInit() {
        this.petForm = this.formBuilder.group({
            id: [],
            petType: ["", [Validators.required]],
            name: ["", [Validators.required]],
            gender: ["", [Validators.required]],
            dob: ["", [Validators.required]],
            beed: ["", [Validators.required]],
            pet_fleas: [""],
            desexed: [""],
            children_stay: [""],
            petImage: [null],
            emergency_contacts: ["", [Validators.required]],
            emergency_charge: ["", [Validators.required]],
            weight: [""],
            dangerDog: [],
            habbits: [""],
            microchipYesNo: [],
            microchip: [""],
            rspcaTAG: [],
            pet_rego: [""],
            pet_council: [""],
            councilTag: [],
            personalTag: [],
            friendly_pet: [],
            love_men: [],
            love_women: [],
            petspend_home: [""],
            petspend_out: [""],
            petsleep_night: [""],
            petalone_hour: [""],
            pet_react: [""],
            pet_walk: [""],
            pet_behave: [""],
            additional_care: [""],
            health_issue: [""],
            on_medication: [],
            medication_instructions: [""],
            usual_vet: [""],
            about_breed: [""],
            attend_training: [""],
            toilet_trained: [""],
            use_for_toilet: [""],
            minder_cat: [],
            minder_dog: [],
            care_routine_breakfast_desc: [""],
            care_routine_breakfast_time: [""],
            care_routine_dinner_desc: [""],
            care_routine_dinner_time: [""],
            food_considerations: [""],
            food_consideration: this.formBuilder.array([]),
            supplements: this.formBuilder.array([]),
            supplement: [""],
            exercise: this.formBuilder.array([]),
            bone_problem: [""],
            extra_details: [""],
            exercise_freq: [""],
            exercise_time: [""],
            walkdistance: [""],
            sleeping_location: [""],
            parasite_flea_description: [""],
            parasite_flea_frequency: [""],
            parasite_flea_date: [""],
            parasite_heartworm_date: [""],
            parasite_heartworm_description: [""],
            parasite_heartworm_frequency: [""],
            parasite_stomach_wormer_date: [""],
            parasite_stomach_wormer_frequency: [""],
            parasite_stomach_wormer_description: [""],
            grooming_location: [""],
            grooming_frequency: [""],
            grooming_date: [""],
            insurance_cover_insurance_name: [""],
            insurance_cover_insurance_amount: [""],
            vaccinationsbl_date1: [""],
            vaccinationsbl_date2: [""],
            vaccinationsbl_date3: [""],
            vaccinationsbl_date4: [""],
            non_core_vaccinationsbl_date1: [""],
            parasite_control: this.formBuilder.array([]),
            other_medications: this.formBuilder.array([]),
            agree: [""],
            emergency_contactsbl_contact_name: [""],
            emergency_contactsbl_contact_number: [""],
            emergency_contactsbl_contact_email: [""],
            emergency_contactsbl_vet_name: [""],
            emergency_contactsbl_vet_email: [""],

        });
        this.selectedSegment = "details";
        this.getVaccinationAlert();
        this.getUploadedVaccinationRecord();
        this.getInsurancePolicy();
    }

    initParasiteControlItems(data?) {
        if(data){
            return this.formBuilder.group({
                type: data.type,
                application: data.application,
                brand: data.brand,
                product: data.product,
                frequency: data.frequency,
            });    
        }
        return this.formBuilder.group({
            type: [''],
            application: [''],
            brand: [''],
            product: [''],
            frequency: [''],
        });
    }

    initother_medications(data?) {
        if (data) {
            return this.formBuilder.group({
                type: data.type,
                application: data.application,
                brand: data.brand,
                product: data.product,
                frequency: data.frequency,
            });
        }
        return this.formBuilder.group({
            type: [''],
            application: [''],
            brand: [''],
            product: [''],
            frequency: [''],
        });
    }



    get otherMedsArr() {
        return this.petForm.get('other_medications') as FormArray;
    }

    get parastiteArr() {
        return this.petForm.get('parasite_control') as FormArray;
    }


    addParasiteControl() {
        this.parastiteArr.push(this.initParasiteControlItems());
    }

    addOtherMedicine() {
        this.otherMedsArr.push(this.initother_medications());
    }



    ionViewDidEnter() {
        // fillup form with already stored value.
        this.getPet(this.selectedPetId);
        localStorage.setItem("updatePetId", this.selectedPetId);
    }

    /**
     * Get Pet details
     * @param petId
     */
    public getPet(petId: any) {

        this.api.showLoader();
        this.api
            .getPet(petId)
            .pipe(
                finalize(() => {
                    this.api.hideLoader();
                })
            )
            .subscribe(
                (res: any) => {
                    const petData: any = res.pet;
                    this.newPetid = petData.id;
                    localStorage.setItem("updatePetId", petData.id);
                    this.petForm.patchValue({
                        id: petData.id,
                        petType:
                            petData.petType != null || petData.petType != undefined
                                ? petData.petType
                                : "",
                        name: petData.name,
                        gender: petData.gender,
                        dob:
                            petData.dob == "1970-01-01" || petData.dob == null
                                ? new Date()
                                : petData.dob,
                        beed: petData.beed,
                        pet_fleas:
                            petData.pet_fleas == null ? "" : petData.pet_fleas,
                        desexed: petData.desexed,
                        children_stay:
                            petData.children_stay != null ||
                                petData.children_stay != undefined
                                ? petData.children_stay
                                : "",
                        emergency_contacts: petData.emergency_contacts,
                        emergency_charge: petData.emergency_charge,
                        petImage: petData.imagename,
                        weight:
                            petData.weight == null || petData.weight == undefined
                                ? "1"
                                : petData.weight,
                        dangerDog: false,
                        habbits: petData.habbits,
                        microchipYesNo:
                            petData.microchip !== null && petData.microchip.length > 0
                                ? true
                                : false,
                        microchip: petData.microchip,
                        rspcaTAG: petData.rspcaTAG == false ? '' : true,
                        pet_rego: petData.pet_rego,
                        pet_council: petData.pet_council,
                        councilTag: petData.councilTag == 1 ? true : false,
                        personalTag: petData.personalTag == 1 ? true : false,
                        friendly_pet: petData.friendly_pet == "Y" ? true : false,
                        love_men: petData.love_men == "Y" ? true : false,
                        love_women: petData.love_women == "Y" ? true : false,
                        petspend_home: petData.petspend_home,
                        petspend_out: petData.petspend_out,
                        petsleep_night: petData.petsleep_night ? parseInt(petData.petsleep_night) : "",
                        petalone_hour: petData.petalone_hour,
                        pet_react: petData.pet_react,
                        pet_walk: petData.pet_walk,
                        pet_behave: petData.pet_behave,
                        additional_care: petData.additional_care,
                        health_issue: petData.health_issue,
                        on_medication: petData.on_medication == 1 ? true : false,
                        medication_instructions: petData.medication_instructions,
                        usual_vet: petData.usual_vet,
                        minder_cat: petData.minder_cat == "Y" ? true : false,
                        minder_dog: petData.minder_dog == "Y" ? true : false,
                        attend_training: petData.attend_training == "Y" ? true : false,
                        toilet_trained: petData.toilet_trained,
                        use_for_toilet: petData.use_for_toilet,
                        about_breed: petData.about_breed,
                       
                    })

                    this.petType = res.pet.petType;

                    if (this.petType == 1) {
                        this.coreVaccination = this.coreVaccinationType1;
                        
                    } else if (this.petType == 2) {
                        this.coreVaccination = this.coreVaccinationType2;
                    } else {
                        this.coreVaccination = this.coreVaccinationType3;
                    }

                    if (petData.care_routine) {

                        this.petForm.patchValue({
                            care_routine_breakfast_desc: petData.care_routine.breakfast?.description,
                            care_routine_breakfast_time: moment(petData.care_routine.breakfast?.time, ["hh:mm a"]).format("hh:mm"),

                            care_routine_dinner_desc: petData.care_routine.dinner?.description,
                            care_routine_dinner_time: moment(petData.care_routine.dinner?.time, ["hh:mm a"]).format("hh:mm"),

                            extra_details: petData.care_routine["extra-details"],
                            sleeping_location: petData.care_routine["sleeping_location"],
                            grooming_location: petData.care_routine.grooming?.location,
                            grooming_frequency: petData.care_routine.grooming?.frequency,
                            grooming_date: petData?.care_routine.grooming?.date,
                  
                            parasite_flea_description: petData.care_routine.parasite_control  ? petData.care_routine.parasite_control["flea_control"].description : "",
                            parasite_flea_frequency:  petData.care_routine.parasite_control ? petData.care_routine.parasite_control["flea_control"].frequency : "",
                            parasite_flea_date:  petData.care_routine.parasite_control ? petData.care_routine.parasite_control["flea_control"].date : "",

                            parasite_heartworm_description:  petData.care_routine.parasite_control ? petData.care_routine.parasite_control["flea_control"].description : "",
                            parasite_heartworm_frequency: petData.care_routine.parasite_control ?  petData.care_routine.parasite_control["flea_control"].frequency : "",
                            parasite_heartworm_date: petData.care_routine.parasite_control ? petData.care_routine.parasite_control["flea_control"].date : "",

                            parasite_stomach_wormer_date: petData.care_routine.parasite_control ?  petData.care_routine.parasite_control["stomach_wormer"].date : "",
                            parasite_stomach_wormer_frequency: petData.care_routine.parasite_control ? petData.care_routine.parasite_control["stomach_wormer"].frequency : "",
                            parasite_stomach_wormer_description: petData.care_routine.parasite_control ?  petData.care_routine.parasite_control["stomach_wormer"].description : "",
                            bone_problem: (petData.care_routine.bone_problem?.length > 0) ? petData.care_routine.bone_problem : [],
                            exercise_freq: petData.care_routine.exercise?.frequency,
                            walkdistance: petData.care_routine.exercise?.distance,
                            exercise_time: (petData.care_routine.exercise?.time?.length > 0) ? petData.care_routine.exercise.time : "",
                            food_considerations: (petData.care_routine.food_consideration?.length > 0) ? petData.care_routine.food_consideration : [],
                            supplement: (petData.care_routine.supplements?.length > 0) ? petData.care_routine.supplements : []
                        })



                        this.bone_problems.forEach(element => {
                            if (this.petForm.value.bone_problem.length > 0) {
                                this.petForm.value.bone_problem.forEach(ele => {
                                    if (element.value == ele) {
                                        element.isChecked = true
                                    }
                                });
                            }
                        });
                    }

                    
                    if(petData.other_medications){
                        if(petData.other_medications.length){
                            petData.other_medications.forEach(element => {
                                this.otherMedsArr.push(this.initother_medications(element));
                            })        
                        }
                    }

                    if(petData.parasite_control){
                        if(petData.parasite_control.length){
                            petData.parasite_control.forEach(element => {
                                this.parastiteArr.push(this.initParasiteControlItems(element));
                            })        
                        }
                    }

                 
                    if (petData.emergency_contactsbl) {
                        let emergency_contactsbl = petData.emergency_contactsbl.emergency_contactsbl;
                        if (emergency_contactsbl) {
                            if (emergency_contactsbl.contact) {
                                this.petForm.patchValue({
                                    emergency_contactsbl_contact_name: emergency_contactsbl.contact.name,
                                    emergency_contactsbl_contact_number: emergency_contactsbl.contact.number,
                                    emergency_contactsbl_contact_email: emergency_contactsbl.contact.email,
                                })
                            }
                            if (emergency_contactsbl.vet) {
                                this.petForm.patchValue({
                                    emergency_contactsbl_vet_name: emergency_contactsbl.vet.name,
                                    emergency_contactsbl_vet_email: emergency_contactsbl.vet.email
                                })
                            }
                        }


                    }

                    if (petData.insurance_cover) {
                        let insurancecover =petData.insurance_cover.insurance
                        if (insurancecover) {
                            this.petForm.patchValue({
                                insurance_cover_insurance_name: insurancecover.name,
                                insurance_cover_insurance_amount: insurancecover.amount,
                            })
                        }
                    }
                    if (petData.vaccinationsbl) {
                        if (petData.vaccinationsbl.length) {
                            this.petForm.patchValue({
                                vaccinationsbl_date1: petData.vaccinationsbl[0].date,
                                vaccinationsbl_date2: petData.vaccinationsbl[1].date,
                                vaccinationsbl_date3: petData.vaccinationsbl[2].date,
                                vaccinationsbl_date4: petData.vaccinationsbl[3].date,
                            })

                            console.log(this.todayDate)
                            console.log(petData.vaccinationsbl[0].date );

                            petData.vaccinationsbl[0].date != "" ? this.todayDate > petData.vaccinationsbl[0].date ? this.coreVaccination[0].disabled = true : this.coreVaccination[0].disabled = false : this.coreVaccination[0].disabled
                            petData.vaccinationsbl[1].date != "" ? this.todayDate > petData.vaccinationsbl[1].date ? this.coreVaccination[1].disabled = true : this.coreVaccination[1].disabled = false : this.coreVaccination[1].disabled
                            petData.vaccinationsbl[2].date != "" ? this.todayDate > petData.vaccinationsbl[2].date ? this.coreVaccination[2].disabled = true : this.coreVaccination[2].disabled = false : this.coreVaccination[2].disabled
                            petData.vaccinationsbl[3].date != "" ? this.todayDate > petData.vaccinationsbl[3].date ? this.coreVaccination[3].disabled = true : this.coreVaccination[3].disabled = false : this.coreVaccination[3].disabled
                            petData.vaccinationsbl[2].date != "" ? this.todayDate > petData.vaccinationsbl[2].date ? this.coreVaccination[4].disabled = true : this.coreVaccination[4].disabled = false : this.coreVaccination[4].disabled
                            
                        }
                    }
                    if (petData.non_core_vaccinationsbl) {
                        if (petData.non_core_vaccinationsbl.length) {
                            this.petForm.patchValue({
                                non_core_vaccinationsbl_date1: petData.non_core_vaccinationsbl[0].date
                            })
                        }
                    }

                    this.selectedPetImage =
                        "https://cdn.petcloud.com.au/uploads/pet/" + petData.imagename;
                },
                (err: any) => {
                    this.api.showToast(
                        "Pet not found please go back and Try again!",
                        2000,
                        "bottom"
                    );
                    this.api.autoLogout(err, petId);
                }
            );
    }

    public getUploadedVaccinationRecord() {
        this.api.getUploadedVaccinationRecord(this.selectedPetId).subscribe(
            (res: any) => {
                if (res.status) {
                    this.isVaccineRecordUploaded = true;
                    this.fileURLVaccine = res.image;
                }
            },
            (err) => {
                this.api.autoLogout(err, this.selectedPetId);
            }
        );
    }

    public uploadVaccinationRecord(image) {
        this.api.showLoader();
        const data = {
            data: image,
            name: this.api.generateRandomId(7) + ".jpg",
        };

        this.api
            .uploadVaccinationRecord(this.selectedPetId, data)
            .subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                    this.api.showToast("Record Uploaded", "3000","bottom");
                    this.getUploadedVaccinationRecord();
                }
            }),
            (err) => {
                this.api.autoLogout(err, data);
            };
    }

    uploadInsurancePolicy(image) {
        this.api.showLoader();
        const data = {
            data: image,
            name: this.api.generateRandomId(7) + ".jpg",
        };

        this.api
            .uploadInsurancePolicy(this.selectedPetId, data)
            .subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                    this.api.showToast("Record Uploaded", "3000","bottom");
                    this.getInsurancePolicy();
                }
            }),
            (err) => {
                this.api.autoLogout(err, data);
            };
    }


    public onChangeBoneProblem(event, value) {
        if (value.label == "Have arthritis") {
            value.isChecked = event.detail.checked;
        } else if (value.label == "Has hip dysplasia") {
            value.isChecked = event.detail.checked;
        }
    }

    public updatePetProfile() {
        let petForm = this.petForm.value;
        let parasite_control = {};
        petForm.councilTag = petForm.councilTag == true ? "1" : "0";
        petForm.personalTag = petForm.personalTag == true ? "1" : "0";
        petForm.microchipYesNo = petForm.microchipYesNo == true ? "1" : "0";
        petForm.on_medication = petForm.on_medication == true ? "1" : "0";
        petForm.friendly_pet = petForm.friendly_pet == true ? "Y" : "N";
        petForm.love_men = petForm.love_men == true ? "Y" : "N";
        petForm.love_women = petForm.love_women == true ? "Y" : "N";
        petForm.on_medication = petForm.on_medication == true ? 1 : 0;
        petForm.microchip = petForm.microchip == null ||
            petForm.microchip == "" ? "" : petForm.microchip.toString();
        petForm.minder_cat = petForm.minder_cat == true ? "Y" : "N";
        petForm.minder_dog = petForm.minder_dog == true ? "Y" : "N";
        petForm.attend_training = petForm.attend_training == true ? "Y" : "N";
        petForm.emergency_charge = petForm.emergency_charge;
        petForm.emergency_contacts = petForm.emergency_contacts;
        this.petForm.value.exercise = {
            "frequency": petForm.exercise_freq,
            "time": petForm.exercise_time,
            "distance": petForm.walkdistance,
        },
            parasite_control = {

                "flea_control": {
                    "description": petForm.parasite_flea_description,
                    "frequency": petForm.parasite_flea_frequency,
                    "date": petForm.parasite_flea_date != "" ? moment(petForm.parasite_flea_date).format("YYYY-MM-DD") : "",
                }, "heartworm": {
                    "description": petForm.parasite_heartworm_description,
                    "frequency": petForm.parasite_heartworm_frequency,
                    "date": petForm.parasite_heartworm_date != "" ? moment(petForm.parasite_heartworm_date).format("YYYY-MM-DD") : "",
                },
                "stomach_wormer": {
                    "description": petForm.parasite_stomach_wormer_description,
                    "frequency": petForm.parasite_stomach_wormer_frequency,
                    "date": petForm.parasite_stomach_wormer_date != "" ?
                        moment(petForm.parasite_stomach_wormer_date).format("YYYY-MM-DD") : "",
                }
            }


        this.petForm.value.grooming = {
            frequency: petForm.grooming_frequency,
            date: petForm.grooming_date != "" ? moment(petForm.grooming_date).format("YYYY-MM-DD") : "",
            location: petForm.grooming_location
        }
        const care_routine = {
            breakfast: {
                time: petForm.care_routine_breakfast_time != "" ? moment(petForm.care_routine_breakfast_time, ["HH.mm"]).format("hh:mm a") : ""
                , description: petForm.care_routine_breakfast_desc
            },
            dinner: {
                description: petForm.care_routine_dinner_desc, time:
                    petForm.care_routine_dinner_time != "" ? moment(petForm.care_routine_dinner_time, ["HH.mm"]).format("hh:mm a") : ""
            },
            "extra-details": petForm.extra_details,
            parasite_control,
            grooming: petForm.grooming,
            food_consideration: petForm.food_considerations,
            supplements: petForm.supplement,
            exercise: petForm.exercise,
            "bone_problem": this.bone_problems.length ? this.bone_problems.filter(boneProb => boneProb.isChecked == true).map(data => data.label) : [],
            "sleeping_location": petForm.sleeping_location,
        }
        const emergency_contactsbl =
        {
            "emergency_contactsbl": {
                "contact": {
                    "name": petForm.emergency_contactsbl_contact_name,
                    "number": petForm.emergency_contactsbl_contact_number,
                    "email": petForm.emergency_contactsbl_contact_email,
                },
                "vet": {
                    "name": petForm.emergency_contactsbl_vet_name,
                    "email": petForm.emergency_contactsbl_vet_email
                }
            }
        }
        const insurance_cover = {
            "insurance_cover": {
                "insurance": {
                    "name": petForm.insurance_cover_insurance_name,
                    "amount": petForm.insurance_cover_insurance_amount
                }
            }
        }
        const vaccinationsbl = {
            "vaccinationsbl": [
                { "date": petForm.vaccinationsbl_date1 != "" ? this.convertDate(petForm.vaccinationsbl_date1) : "" },
                { "date": petForm.vaccinationsbl_date2 != "" ? this.convertDate(petForm.vaccinationsbl_date2) : "" },
                { "date": petForm.vaccinationsbl_date3 != "" ? this.convertDate(petForm.vaccinationsbl_date3) : "" },
                { "date": petForm.vaccinationsbl_date4 != "" ? this.convertDate(petForm.vaccinationsbl_date4) : "" },
            ],
        }
        const non_core_vaccinationsbl = {
            "non_core_vaccinationsbl": [
                { "date": petForm.non_core_vaccinationsbl_date1 != "" ? this.convertDate(petForm.non_core_vaccinationsbl_date1) : "" },
            ],
        }
        petForm.care_routine = care_routine;
        petForm.emergency_contactsbl = emergency_contactsbl;
        petForm.insurance_cover = insurance_cover.insurance_cover;
        petForm.vaccinationsbl = vaccinationsbl.vaccinationsbl;
        petForm.non_core_vaccinationsbl = non_core_vaccinationsbl.non_core_vaccinationsbl;
        petForm.parasite_control = this.petForm.value.parasite_control;
        petForm.other_medications = this.petForm.value.other_medications;

        if (petForm.dangerDog == true) {
            this.api.showAlert(
                "Pet Disallowed",
                "Unfortunately, we can't allow you register a dangerous dog. Ensuring the safety of our customers is PetCloud's first priority. We hope you understand",
                ["ok"]
            );
            return false;
        } else if (petForm.microchipYesNo == 1 && petForm.microchip == "") {
            this.api.showAlert(
                "Microchip Number",
                "Please Enter Microchip Number.",
                ["ok"]
            );
            return false;
        }

        const pets = {
            Pets: petForm,
        };
        this.api.showLoader();

        this.api
            .updatePetProfile(pets, this.newPetid)
            .pipe(
                finalize(() => {
                    this.api.hideLoader();
                })
            )
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.api.showToast("Pet profile Updated.", 2000, "bottom");
                        // this.selectedSegment = 'image';
                    }
                },
                (err: any) => {
                    this.api.showToast("Pet profile not updated.", 2000, "bottom");
                    this.api.autoLogout(err, petForm);
                }
            );
    }

    // Show action sheet to display option for upload pet image with camera or gallery
    async showActionSheet(param) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: "choose Photo from",
            buttons: [
                {
                    text: "Camera",
                    icon: "camera",
                    handler: () => {

                        this.pickImage(this.camera.PictureSourceType.CAMERA, param);
                    },
                },
                {
                    text: "Gallery",
                    icon: "images",
                    handler: async () => {
                        const status = await this.cameraAPI.checkPhotoLibraryPermission();
                        if(status) {
                            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY, param);
                        }
                    },
                },
                {
                    text: "Cancel",
                    icon: "close",
                    role: "cancel",
                    handler: () => {
                    },
                },
            ],
        });

        await actionSheet.present();
    }


    async pickImage(params, param) {

        this.cameraAPI.getPicture(params).then((base64: any) => {
            console.log('pickImage',param,  );
            
            this.selectedPetImage = "data:image/jpeg;base64," + base64;
            let imageURL = "data:image/jpeg;base64," + base64;
            if (param == "petprofile") {
                this.uploadImageData(imageURL, param);
            } else if (param == "vaccinerecord") {
                this.uploadVaccinationRecord(imageURL);
            } else if (param == "insurancepolicy") {
                this.uploadInsurancePolicy(imageURL);
            }
        }, err => {
        })
    }

    // upload image to the server
    async uploadImageData(imageUrL, param) {
        const fileParams = {
            data: imageUrL,
            name: "Imagename.jpg",
            id: this.newPetid,
        };
        console.log('newPetid',this.newPetid );
        this.api.showLoader();
        this.api
            .uploadImagefile(fileParams)
            .pipe(
                finalize(() => {
                    this.api.hideLoader();
                })
            )
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.api.showToast("Photo Updated.", 2000, "bottom");
                    } else {
                        this.api.showToast("Error: Image upload failed.", 2000, "bottom");
                    }
                },
                (err: any) => {
                    this.api.autoLogout(err, fileParams);
                }
            );
    }

    public setDate(dateStr): any {
        let str = dateStr;
        // str = str.split('/').join('-');
        str = new Date(str).toISOString();
        return str;
    }

    public async getVaccinationAlert() {
        this.api.getVaccinationAlert(this.selectedPetId).subscribe(
            (res: any) => {
                if (res.success) {
                    if (res.data) {
                        this.healthAlerts = res.data;
                        console.log("health alert", this.healthAlerts);
                    }
                }
            },
            (err) => {
            }
        );
    }

    getInsurancePolicy() {
        this.api.getInsurancePolicy(this.selectedPetId).subscribe(
            (res: any) => {
                if (res.status) {
                    if (res.image) {
                        this.vaccinationRecordImage = res.image;
                    } else {
                        this.vaccinationRecordImage = ""
                    }
                } else {
                    this.vaccinationRecordImage = ""
                }
            },
            (err) => {
            }
        );
    }

    public async deleteVaccine(id) {
        this.api.deleteVaccinationRecord(id).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getVaccinationAlert();
                } else {
                }
            },
            (err) => {
            }
        );
    }

    public async addVacination() {
        const modal = await this.modalCtrl.create({
            component: AddVacinationComponent,
            animated: true,
            componentProps: {
                petId: this.selectedPetId,
            },
        });
        modal.onDidDismiss().then((data: any) => {
            this.getVaccinationAlert();
        });
        return await modal.present();
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

    public getReminderType(reminderType: any): any {
        return PetcloudApiService.remindersType(reminderType);
    }

    public reminderFrequency(reminderFreq: any): any {
        return PetcloudApiService.reminderFrequency(reminderFreq);
    }

    async vaccinationExplaination() {

        const modal = await this.modalCtrl.create({
            component: VaccinationExplainationComponent,
            animated: true,
            componentProps: {
            },
        });
        modal.onDidDismiss().then((data: any) => {
        });
        return await modal.present();

    }

    openPrescription() {
        this.api.openExteralLinks(this.fileURLVaccine)
    }

    openActiveBlock(activeBlock) {
        if (this.activeCard.length > 0) {
            // store index of value in array
            const indx = this.activeCard.indexOf(activeBlock);
            if (indx >= 0) {
                this.activeCard.splice(indx, 1);
            } else {
                this.activeCard.push(activeBlock);
            }
        } else {
            this.activeCard.push(activeBlock);
        }
    }

    convertDate(date) {
        return new DatePipe("en-US").transform(date, "y-MM-dd")
    }
}
