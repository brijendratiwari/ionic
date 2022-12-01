import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { NavController, ActionSheetController } from "@ionic/angular";
import { Device } from "@ionic-native/device/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { finalize } from 'rxjs/operators';import { DatePipe } from '@angular/common';
import { CameraService } from "../camera-service.service";
import { Camera, CameraOptions} from "@ionic-native/camera/ngx";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"],
})
export class FeedbackPage implements OnInit {
  public feedbackForm: FormGroup;

  public deviceInfo: any = {
    appVersion: "",
    versionNumber: "",
    version: "",
    manufacturer: "",
    model: "",
  };
  myImageUrl: any;
  public maxDate: any;
  constructor(
    private formBuilder: FormBuilder,
    public device: Device,
    public appVersion: AppVersion,
    public api: PetcloudApiService,
    public navcntl: NavController,
    public cameraAPI:CameraService,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
  ) {
    this.maxDate = new Date().toISOString();
    this.deviceInfo.version = device.version;
    this.deviceInfo.manufacturer = device.manufacturer;
    this.deviceInfo.model = device.model;


    this.appVersion
      .getVersionNumber()
      .then((value) => {
        this.deviceInfo.versionNumber = value;
      })
      .catch((err) => {
        
      });

    this.appVersion
      .getVersionCode()
      .then((value) => {
        this.deviceInfo.appVersion = value;
      })
      .catch((err) => {
        
      });
  }

  ngOnInit() {

    this.feedbackForm = this.formBuilder.group({
      app_version: ["", [Validators.required]],
      device_info: ["", [Validators.required]],
      expectation_to_happen: ["", [Validators.required]],
      actually_happen: ["", [Validators.required]],
      user_doing: ["", [Validators.required]],
      error_received: ["", [Validators.required]],
      date: [new Date().toISOString()],
      time: [new Date().toISOString()],
      description: ["", [Validators.required]],
      screenShot: [""],
    });

    this.appVersion
      .getVersionNumber()
      .then((value) => {
        this.deviceInfo.versionNumber = value;

        this.feedbackForm.patchValue({
          app_version: value,
        });

      })
      .catch((err) => {
        
      });


    let deviceModel = this.deviceInfo.manufacturer + " " + this.deviceInfo.model;
    this.feedbackForm.patchValue({
      app_version: this.deviceInfo.versionNumber,
      device_info: deviceModel
    });
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
        header: 'Select Profile Photo From',
        buttons: [{
            text: 'Camera',
            handler: () => {
                this.photoOption(this.camera.PictureSourceType.CAMERA);
            }
        }, {
            text: 'Gallery',
            handler: async () => {
              const status = await this.cameraAPI.checkPhotoLibraryPermission();
              if(status) {
                this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
            }
        }, {
            text: 'Cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }]
    });
    await actionSheet.present();
}

  sendFeedback() {
   const issueForm = {
     Issue:{
      app_version: this.feedbackForm.value.app_version,
      device_info:this.feedbackForm.value.device_info,
      actually_happen:this.feedbackForm.value.actually_happen,
      user_doing:this.feedbackForm.value.user_doing,
      error_received:this.feedbackForm.value.error_received,
      date:new DatePipe('en-US').transform(this.feedbackForm.value.date, 'y-MM-dd'),
      time:new DatePipe('en-US').transform(this.feedbackForm.value.time, 'h:mm a'),
      description:this.feedbackForm.value.description,
      expectation_to_happen:this.feedbackForm.value.expectation_to_happen,
      image_file:this.feedbackForm.value.screenShot
     }
   }
    
   console.log("issue form value", issueForm);
    this.api.showLoader()
    this.api.sendAppFeedback(issueForm)
        .pipe(finalize(() => {
            // hide loader in success
            this.api.hideLoader();
        }))
        .subscribe((res: any) => {
            if (res.success) {
                this.api.showToast(res.message, 2000, 'bottom');
                // this.navcntl.navigateBack('/home/tabs/profile-menu')
            } else {
                this.api.showToast(res.message, 2000, 'bottom');
            }
        }, (err) => {
            // hide loader in error
            this.api.autoLogout(err,issueForm);
        });
  }

  fromDate(event) {
    console.log(event);
  }

  time(event) {
    console.log(event);
  }

  photoOption(params) {

   this.cameraAPI.getPicture(params).then((imageData)=>{
      this.myImageUrl = 'data:image/jpeg;base64,' + imageData;
      this.ImageUpload(this.myImageUrl);
    },err=>{
      
    })
}

ImageUpload(imageData) {
   
        const fileParams = { data: imageData, name: "Imagename.jpg", };
            this.api.showLoader();
            console.log(fileParams);
            this.api.issueScreenshot(fileParams).pipe(
                finalize(() => {
                    this.api.hideLoader();
                }))
                .subscribe((res: any) => {
                    console.log(res);
                    if (res.success) {
                        this.api.hideLoader();

                        this.feedbackForm.patchValue({
                          screenShot: res.filename
                        })

                        this.api.showToast('File Uploaded.', 2000, 'bottom');
                     
                    } else {
                      this.api.showToast("Error: Image upload failed.", 2000, "bottom");
                    }
                }, (err: any) => {
                    this.api.autoLogout(err,fileParams)
                });
        }
}
