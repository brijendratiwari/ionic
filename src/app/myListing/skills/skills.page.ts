import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

// importing model files
import { ApiResponse } from '../../model/api-response';
import { finalize } from 'rxjs/operators';
import { NavController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.page.html',
    styleUrls: ['./skills.page.scss'],
})
export class SkillsPage implements OnInit {

    public skillFrm: FormGroup;
    public petBreeds = [];
    public userId: any = '';

    constructor(public api: PetcloudApiService, 
        private formBuilder: FormBuilder, 
        private platform: Platform,
        protected router: Router, 
        protected storage: Storage,
        public navCtrl: NavController
    ) { }

    ngOnInit() {
        this.skillFrm = this.formBuilder.group({
            experiencePets: [false],
            experienceYears: ['', [Validators.required]],
            hasQualifications: [false],
            qualifications: ['', [Validators.required]],
            specific_breeds: [''],
            SpecialSkills: [''],
            specific_skills: ['']
        });

    }

    ionViewDidEnter() {
        this.getSkills();
        this.storage.get(PetcloudApiService.USER)
            .then((res: any) => {
                this.userId = res.id;
            });
    }
    ionViewWillLeave() {
        this.removeAnchorEventListner();
    }
    generateAnchorEventListner() {
        const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
        if(anchorElements?.length>0) {
          anchorElements.forEach((elem)=>{
            if(this.platform.is('cordova') && elem?.target!= "_system") {
              elem.setAttribute('target', '_system');
            }
            elem.addEventListener('click', (e) => { 
              e.preventDefault(); 
              this.validateAndRedirect(elem.href)
            });
          })
        }
      }
      removeAnchorEventListner() {
        const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
        if(anchorElements?.length>0) {
          anchorElements.forEach((elem)=>{        
            elem.removeEventListener('click', (e) => { 
              e.preventDefault(); 
              this.validateAndRedirect(elem.href)
            });
          })
        }
      }
      validateAndRedirect(herf) {
        if(herf) {
          const isValid = this.api.validURL(herf);
          console.log("isValid", herf, isValid)
          if(isValid && this.platform.is('cordova')) {
            this.api.openExteralLinks(herf);
          }
        }
      }

    public getAllPetBreed() {
        this.api.getAllPetBreed().pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe((res: any) => {
            console.log("this.petBreeds", this.petBreeds)
            this.petBreeds = res;
        }, (err: any) => {
            this.api.autoLogout(err,"");
        });
    }


    /**
     * Sace Listing skills.
     */
    public saveListingSkill() {
        this.api.showLoader();
        let skillFrm = this.skillFrm.value;
        skillFrm.experiencePets = (skillFrm.experiencePets === true) ? '1' : '0';
        skillFrm.hasQualifications = (skillFrm.hasQualifications === true) ? '1' : '0';
        // skillFrm.userId = this.userId;

        // save updated data
        this.api.updateSkills(skillFrm).pipe(finalize(() => {
            this.api.hideLoader();
        }))
            .subscribe((res: any) => {
                if (res.success) {
                    this.storage.set(PetcloudApiService.USER, res.user);
                    this.api.showToast('skill update successfull.', 2000, 'bottom');
                } else {
                    this.api.showToast('skill not update.', 2000, 'bottom');
                }
            }, (err: any) => {
                console.log('error in save skills', err);
                this.api.showToast('skill not update.', 2000, 'bottom');
                this.api.autoLogout(err,skillFrm)
            });
        // console.log(skillFrm);
    }

    /**
     * Get Skills details
     */
    public getSkills() {
        this.api.showLoader();
        // first fetch all pet breeds.
        this.getAllPetBreed();
        this.api.getListingInfo()
            .subscribe((res: ApiResponse) => {
                let UserListing: any = res.user;
                let petBridsIds = [];
                let skillIds = [];
                this.generateAnchorEventListner();
                for (let i in UserListing.petbreeds) {
                    petBridsIds.push(UserListing.petbreeds[i].id);
                }

                for (let s in UserListing.specialskills) {
                    skillIds.push(UserListing.specialskills[s].specialSkillID);
                }
                this.api.hideLoader();
                this.skillFrm.setValue({
                    experiencePets: (UserListing.experiencePets != null && UserListing.experiencePets == '1') ? true : false,
                    experienceYears: UserListing.experienceYears,
                    hasQualifications: (UserListing.hasQualifications != null && UserListing.hasQualifications == '1') ? true : false,
                    qualifications: UserListing.qualifications,
                    specific_breeds: petBridsIds,
                    SpecialSkills: skillIds,
                    specific_skills: (UserListing.specific_skills === null) ? '' : UserListing.specific_skills
                });
            }, (err: any) => {
                this.api.hideLoader();
                this.api.showToast('something went wrong in getting skill details!', 2000, 'bottom');
                // this.api.autoLogout(err)
            });
    }

}
