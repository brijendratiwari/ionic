import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { CameraService } from '../../camera-service.service';
import { Camera, CameraOptions} from "@ionic-native/camera/ngx";

declare var cordova: any;

@Component({
    selector: 'app-listing-photos',
    templateUrl: './listing-photos.page.html',
    styleUrls: ['./listing-photos.page.scss'],
})
export class ListingPhotosPage implements OnInit {

    public spacePhotos = [];

    // for image uploading
    lastImage: string = null;
    public todayDate = new Date();
    public selectedPetImage = '';

    constructor(private api: PetcloudApiService,
        private storage: Storage,
        private platform: Platform,
        public camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private cameraAPI:CameraService,
        protected navCtrl: NavController) {
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.getSpacePhotos();
    }

    public getSpacePhotos() {
        this.api.showLoader();
        this.api.getListingInfo()
            .subscribe((res: any) => {
                this.api.hideLoader();
                if (res.success) {
                    this.spacePhotos = res.user.spaceImages;
                } else {
                    this.api.showToast('space images not found! Try again.', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.hideLoader();

               this.api.autoLogout(err,"");
            });
    }

    public deleteSpaceImage(imageId: any, imageObj: any) {

        // show confirm aler box
        this.api.showAlert('Delete Space Photo!', 'are you sure to delete this space photo?', [
            {
                text: 'cancel',
                role: 'cancel',
                cssClass: 'danger',
                
            }, {
                text: 'ok',
                handler: () => {
                    this.api.showLoader();
                    this.api.deleteSpaceImage(imageId)
                        .subscribe((res: any) => {
                            this.api.hideLoader();
                            if (res.success) {
                                for (let i = 0; i < this.spacePhotos.length; i++) {
                                    if (this.spacePhotos[i] == imageObj) {
                                        this.spacePhotos.splice(i, 1);
                                    }
                                }
                                this.api.showToast('photo deleted successful.', 2000, 'bottom');
                            } else {
                                this.api.showToast('photo not deleted! Try again.', 2000, 'bottom');
                            }
                        }, (err: any) => {
                            this.api.autoLogout(err,imageId);
                        });
                }
            }
        ]);
    }


    async showActionSheet() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'choose photo from',
            buttons: [{
                text: 'Camera',
                icon: 'camera',
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Gallery',
                icon: 'images',
                handler: async () => {
                    const status = await this.cameraAPI.checkPhotoLibraryPermission();
                    if(status) {
                        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
             
            }]
        });

        await actionSheet.present();
    }

    async pickImage(params) {
     
        this.cameraAPI.getPicture(params).then(base64=>{
            let imageURL = "data:image/jpeg;base64," + base64;
            this.uploadImageData(imageURL);
        },err=>{
            
        })
      }


    async uploadImageData(imageURL) {

        let param = {
            data: imageURL,
            name: "imagedata.jpg"
        }
        this.api.showLoader();
        this.api.uploadSpaceImage(param)
            .subscribe(res => {
                this.api.hideLoader();
                if (res['success']) {
                    this.api.showToast('File upload complete now list auto refresh.', 2000, 'bottom');
                    setTimeout(() => {
                        this.getSpacePhotos();
                    }, 2000);
                } else {
                    this.api.showToast('File upload failed.', 2000, 'bottom');
                }
            }, (err: any) => {
                this.api.hideLoader();
                this.api.autoLogout(err,param);
            });
    }
}
