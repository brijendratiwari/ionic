import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActionSheetController } from '@ionic/angular';
import { Camera} from "@ionic-native/camera/ngx";
import { finalize } from 'rxjs/operators';
import { CameraService } from '../camera-service.service';

@Component({
    selector: 'app-pet-add',
    templateUrl: './pet-add.page.html',
    styleUrls: ['./pet-add.page.scss'],
})
export class PetAddPage implements OnInit {

    lastImage: string = null;
    public imagenameResponse: any;
    public todayDate = new Date();
    public selectedPetImage = '';
    public petForm: FormGroup; // initialize formGroup for form validation
    public contactForm: FormGroup; // initialize formGroup for form validation
    public petChildrenStaySelectoption: any = {
        header: 'Fine to stay with children?',
        translucent: true
    };
    public newPetid = 0; // store new added pet id for update
    public selectedSegment = '';
    //Image URL
    public myImageUrl;
    public currnetDt: any;
    public uploadedURL: any;
    public responseImageName: any;

    //Segment Click Disable
    public disablePetInfo: boolean = true; // true
    public disableContactSegment: boolean = true;// true
    public prevURL: any;
    public petNameFile: any;
    public resfileName: any;
    public resimageurl: any;
    isPetAddedSuccess: boolean = false;

    // public disableImageSegment = true;
    public typePet: any = null;
    constructor(public platform: Platform,
        public actionSheetCtrl: ActionSheetController,
        private formBuilder: FormBuilder, public api: PetcloudApiService, protected router: Router,
        public cameraAPI:CameraService,
        public camera: Camera,
        protected nav:NavController,
        protected navCtrl: NavController, protected storage: Storage) {

        this.currnetDt = new Date().toISOString();
        this.getPreviousURL();
    }



    ngOnInit() {
        this.petForm = this.formBuilder.group({
            petType: ['', [Validators.required]],
            name: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            beed: ['', [Validators.required]],
            pet_fleas: [''],
            desexed: [''],
            children_stay: ['', [Validators.required]],
            vet_contact: ['', [Validators.required]],
            vet_amount: ['', [Validators.required]],
            module:"pets",
            imagename: '',  // filename
            imageurl:"",   // complete url of uploadurl
        });

        this.selectedSegment = 'image';
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

    photoOption(params) {
        this.cameraAPI.getPicture(params).then((base64:any)=>{
            this.myImageUrl = 'data:image/jpeg;base64,' + base64;
            this.imageUpload();
        },err=>{
            
        })
    }

    imageUpload() {
        const fileParams = { data: this.myImageUrl, name: "Imagename.jpg" };
        this.api.showLoader();
        this.api.uploadImagefile(fileParams).pipe(
            finalize(() => {
                this.api.hideLoader();
            }))
            .subscribe((res: any) => {
                if (res.success) {
                   
                    this.resfileName = res.filename;
                    this.resimageurl = res.uploadUrl;
                    
                    this.api.showToast('File Uploaded.', 2000, 'bottom');
                    this.disablePetInfo = false;
                    this.disableContactSegment = false;
                    this.selectedSegment = "petInfo"
                } else {
                    this.api.showToast("Error: Image upload failed.", 2000, "bottom");
                }
            }, (err: any) => {
                this.api.autoLogout(err,fileParams)
            });
    }
    /**
     * Save new pet
     */
    public saveNewPet() {

        
        this.petForm.value.imagename =  this.resfileName;
        this.petForm.value.imageurl = this.resimageurl;
        this.api.showLoader();
        this.api.savePet(this.petForm.value).pipe(
            finalize(() => {
                this.api.hideLoader();
            })).subscribe((res: any) => {
                console.log(res);
                if (res.success) {
                    this.isPetAddedSuccess = true;
                    this.newPetid = res.petId;
                    this.selectedSegment = "response"
                    localStorage.setItem('newPetId', res.petId);
                    this.petForm.reset();
                }else{
                    this.isPetAddedSuccess = false;
                }
            }, (err: any) => {
                this.isPetAddedSuccess = false;
                this.api.autoLogout(err,this.petForm.value)
            });
    }

    getPreviousURL() {
        this.storage.get('pervURL').then((val) => {
            this.prevURL = val;
        });
    }

    onChangeFineToStay(event){

        if(this.petForm.value.petType != "" && this.petForm.value.name != "" && 
        this.petForm.value.gender != "" && this.petForm.value.dob != "" && 
        this.petForm.value.beed != ""){
            this.selectedSegment = "contact"
        }else{
            this.selectedSegment = "petInfo"
        }
        
    }

    goToPetListing(){
        this.nav.pop();
    }
}