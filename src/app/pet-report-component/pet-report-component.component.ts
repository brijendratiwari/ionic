import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, Platform, ModalController } from '@ionic/angular';
import { Camera } from "@ionic-native/camera/ngx";
import { CameraService } from '../camera-service.service';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { petRecord } from '../../assets/JSON/petrecord.js'
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pet-report-component',
  templateUrl: './pet-report-component.component.html',
  styleUrls: ['./pet-report-component.component.scss'],
})
export class PetReportComponentComponent implements OnInit {

  petReport: any[] = [];
  selectedPetRecord = null;
  public petImageURL = "";
  public isSubmitButtonEnabled = false

  public petReportForm: FormGroup;

  constructor(public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public api: PetcloudApiService, protected router: Router,
    public cameraAPI: CameraService,
    private formBuilder: FormBuilder,
    public camera: Camera,
    public model: ModalController,
    protected navCtrl: NavController, protected storage: Storage) {
  }

  ngOnInit() {
    this.petReport = petRecord[0];
    console.log("this.petReport", this.petReport)
    this.petReportForm = this.formBuilder.group({
      foodtime: [],
      foodToppedUp: [],
      waterToppedUp: [],
      watertime: [],
      medicines: [],
      medication: [],
      medicationTime: [],
      poo: [],
      pooChecked: [],
      pee: [],
      peeChecked: [],
      propertySecured: [],
      kmsOfDogWalk: [],
      kmsOfDogWalktime: [],
      dogWalk: [],
      dogWalktime: [],
      mood: [],
      specialCareTime: [],
      specialCareChecked: [],
      summary: []
    })
  }



  ionViewWillEnter() {
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Photo From',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.photoOption(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Gallery',
        handler: async () => {
          const status = await this.cameraAPI.checkPhotoLibraryPermission();
          if (status) {
            this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      }, {
        text: 'Cancel',
      }]
    });
    await actionSheet.present();
  }

  photoOption(params) {
    this.cameraAPI.getPicture(params).then((base64: any) => {
      this.petImageURL = 'data:image/jpeg;base64,' + base64;
    }, err => {

    })
  }

  closeModal() {
    this.api.dismissModelorAlert();
  }

  async selectedRecord(petRecord) {
    this.isSubmitButtonEnabled = true
    this.selectedPetRecord = await petRecord;

    for (const [key, value] of Object.entries(this.petReport)) {

      if (key == this.selectedPetRecord.key) {
        value["isSelected"] = true;
        this.selectedPetRecord.isSelected = true;
      } else {
        value["isSelected"] = false;
        this.selectedPetRecord.isSelected = false;
      }
    }
  }

  //Make Unshorted array
  unsorted() { }

  selectedMood(moodData) {

    for (const [key, value] of Object.entries(this.petReport)) {
      if (key == "Mood") {
        value["iconName"].forEach(element => {
          element.name == moodData.name ? element.isSelected = true : element.isSelected = false;
        });
      }
    }
    this.petReportForm.patchValue({
      mood: moodData.name
    })
  }

  selectedTimeForDuration(duration) {

    for (const [key, value] of Object.entries(this.petReport)) {
      if (key == "Duration") {
        value["chips"].forEach(element => {
          element.duration == duration.duration ? element.isSelected = true : element.isSelected = false;
        });
      }
    }
    this.petReportForm.patchValue({
      dogWalktime: duration.duration
    })
  }



  submitPetRecord() {
    const petFormRecord = this.petReportForm.value;

    const petRecordData = {
      "water": {
        waterToppedUp: petFormRecord.waterToppedUp,
        time: petFormRecord.watertime != null ? new DatePipe('en-US').transform(petFormRecord.watertime, 'hh:mm aaa') : null,
      }, "food": {
        foodToppedUp: petFormRecord.foodToppedUp,
        time: petFormRecord.foodtime != null ? new DatePipe('en-US').transform(petFormRecord.foodtime, 'hh:mm aaa') : null,
      }, "medication": {
        medication: petFormRecord.medication,
        medicationTime: petFormRecord.medicationTime != null ? new DatePipe('en-US').transform(petFormRecord.medicationTime, 'hh:mm aaa') : null,
      }, "poo": {
        poo: petFormRecord.pooChecked,
      }, "pee": {
        pee: petFormRecord.peeChecked,
      }, "propertySecured": {
        propertySecured: petFormRecord.propertySecured,
      }, "dogwalk": {
        time: petFormRecord.dogWalktime,
      }, "mood": {
        mood: petFormRecord.mood,
      }, "specialCare": {
        specialCare: petFormRecord.specialCareChecked,
        specialCaretime: petFormRecord.specialCareTime = ! null ? new DatePipe('en-US').transform(petFormRecord.specialCareTime, 'hh:mm aaa') : null,
      }, "image": {
        image: this.petImageURL,
        name: this.petImageURL != "" ? this.api.generateRandomId(5) + ".jpg" : ""
      }, "summary": {
        summary: petFormRecord.summary
      }
    }

    if (!petRecordData.dogwalk.time &&
      !petRecordData.food.foodToppedUp &&
      !petRecordData.medication.medication &&
      !petRecordData.medication.medicationTime &&
      !petRecordData.mood.mood &&
      !petRecordData.pee.pee &&
      !petRecordData.poo.poo &&
      !petRecordData.propertySecured.propertySecured &&
      !petRecordData.specialCare.specialCare && !petRecordData.specialCare.specialCaretime &&
      !petRecordData.summary &&
      !petRecordData.water.waterToppedUp && !petRecordData.water.time
    ) {
      this.api.showToast("Please Enter Records for Reports", 3000, "bottom");
    } else {
      this.model.dismiss(petRecordData);
    }

    console.log("pet record", petRecordData);

  }


}
