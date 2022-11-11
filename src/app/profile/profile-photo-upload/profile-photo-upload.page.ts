import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from './../../api/petcloud-api.service';
import { ActionSheetController } from '@ionic/angular';
import { NavController, Platform } from '@ionic/angular';

// native plugins
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

// import model file
import { User } from '../../model/user';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CameraService } from "../../camera-service.service";
import { Camera, CameraOptions} from "@ionic-native/camera/ngx";

@Component({
    selector: 'app-profile-photo-upload',
    templateUrl: './profile-photo-upload.page.html',
    styleUrls: ['./profile-photo-upload.page.scss'],
})
export class ProfilePhotoUploadPage implements OnInit {

    lastImage: string = null;
    public todayDate = new Date();
    public selectedProfileImage = 'assets/img/sitter1.png';
    myImageUrl: any; 
    prevImageURL: any;
    isPhoneVerify: boolean;
    isEmailVerify: boolean;
    verificationResponse: any;
    uploadUrl: any; // Server Response;
    isImage: boolean = false;
    public userData: User;
    public backButton: any = "";


    constructor(protected storage: Storage, protected navCtrl: NavController,
        private webview: WebView, public platform: Platform, public actionSheetCtrl: ActionSheetController,
        public router: Router,public route: ActivatedRoute,
        public camera:Camera,
        private file: File, private CameraAPI: CameraService, public api: PetcloudApiService) {

            this.backButton = this.route.snapshot.paramMap.get("backBtn");
            
        this.getUserProfilePhoto();
    }

    ngOnInit() {
        this.checkVerification()
    }

    ionViewWillLeave() {
        this.api.hideLoader();
    }

    ionViewDidLeave() {
        this.api.hideLoader();
    }

    public getUserProfilePhoto() {

        this.storage.get(PetcloudApiService.USER)
        .then((res: User) => {
            this.userData = res;

                if (this.userData .imagename !== '' || this.userData .imagename !== null) {
                    this.isImage = false;
                    this.myImageUrl =  this.userData.imagename;
                    this.prevImageURL =  this.userData .imagename;
                } else {
                    this.isImage = true;
                }
            }, (err: any) => {
                console.log('user not found!');
            });
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

    async showActionSheet() {
        await this.platform.ready();
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
                    const status = await this.CameraAPI.checkPhotoLibraryPermission();
                    if(status) {
                      this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }
            }, {
                text: 'Cancel'
            }]
        });
        await actionSheet.present();
    }

    photoOption(params) {

        this.CameraAPI.getPicture(params).then((base64String:any)=>{
            this.myImageUrl = 'data:image/jpeg;base64,' + base64String;
            this.imageUpload();
          },err=>{
            console.error("err", err)
          })
        
    }

    imageUpload() {
        if(this.myImageUrl == "https://cdn.petcloud.com.au/uploads/user/"){
            this.api.showToast("please upload profile pic","2000","bottom")
        }

        else if (this.selectedProfileImage != "" && this.myImageUrl == undefined && this.isImage) {
            if (this.isPhoneVerify && this.isEmailVerify) {
                this.router.navigateByUrl('/home/tabs/profile-menu', { skipLocationChange: true });
            } else {
         
                this.router.navigate([
                    "/profile-photo-upload",
                    { backBtn: true },
                  ]);
                
            }
        }
        else {
            const fileParams = { data: this.myImageUrl, name: "Imagename.jpg", };
            // Same Image from Storage Conditon..
            if (fileParams.data == this.prevImageURL) { 
                if (this.isPhoneVerify && this.isEmailVerify) {
                    this.router.navigateByUrl('/home/tabs/profile-menu', { skipLocationChange: true });
                } else if (this.isEmailVerify == false || this.isPhoneVerify == false) {
                    this.router.navigate(['/profile-email-verify', { backBtn: true }])
                } else if (this.isEmailVerify == undefined || this.isPhoneVerify == undefined) {
                    this.router.navigate(['/profile-email-verify', { backBtn: true }])
                }
            } else {
                
                this.api.showLoader();
                this.api.userImageUpload(fileParams).pipe(
                    finalize(() => {
                        this.api.hideLoader();
                    }))
                    .subscribe((res: any) => {
                        if (res.success) {
                            this.uploadUrl = res.uploadUrl;
                           
                            // Update Image..
                            this.storage.get(PetcloudApiService.USER)
                                .then((userData: User) => {
                                    this.storage.set(PetcloudApiService.USER, userData);
                                });
                            this.api.showToast('Photo Uploaded.', 2000, 'bottom');
                            if (this.isPhoneVerify && this.isEmailVerify) {
                                this.router.navigateByUrl('/home/tabs/profile-menu');
                            } else if (this.isEmailVerify == false || this.isPhoneVerify == false) {
                                this.router.navigate(['/profile-email-verify', { backBtn: true }])
                            } else if (this.isEmailVerify == undefined || this.isPhoneVerify == undefined) {
                                this.router.navigate(['/profile-email-verify', { backBtn: true }])
                            }else{
                                this.router.navigateByUrl('/home/tabs/profile-menu');
                            }
                        } else {
                            this.api.showToast('Failed to add photo.', 2000, 'bottom');
                        }
                    }, (err: any) => {
                        this.api.autoLogout(err,fileParams)
                    });
            }
        }


    }

    backButtonNavigate(){
        if(this.backButton){
            this.router.navigateByUrl('/home/tabs/sitter-listing')
        }else{
            this.navCtrl.pop();
        }
    }


    private checkVerification() {
        this.api.checkVerification().pipe(finalize(() => {
            // this.api.showToast('something went wrong! please Try again.', 2000, 'bottom');
        })).subscribe((res: any) => {
            this.verificationResponse = res;
            if (res.emailVerify.status == "1") {
                this.isEmailVerify = true
            } else if (res.emailVerify.status != "0") {
                this.isEmailVerify = false
            }
            if (res.phoneVerify.verify_phoneflag == "Y") {
                this.isPhoneVerify = true
            } else if (res.phoneVerify.verify_phoneflag != "N") {
                this.isPhoneVerify == false;
            }

        }, err => {
            this.api.autoLogout(err,"");
        })
    }
}
