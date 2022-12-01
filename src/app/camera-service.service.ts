import { Injectable } from '@angular/core';
import { Camera, CameraOptions} from "@ionic-native/camera/ngx";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';


@Injectable()

export class CameraService {



  constructor(private camera: Camera, private diagnostic: Diagnostic, private platform: Platform) {
   }

   getPicture(params) : Promise<any> {
    let options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: params,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: (params == this.camera.PictureSourceType.CAMERA || this.platform.is('android'))? false : true,
    };
     // get the picture 
     return this.camera.getPicture(options);
   }

   async checkPhotoLibraryPermission() {
     try {
      const status = await this.diagnostic.getCameraRollAuthorizationStatus();
      let repsStatus = true;
      switch(status) {
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
          repsStatus = false;
          break;
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
          repsStatus = false;
          break;
        case this.diagnostic.permissionStatus.GRANTED:
          repsStatus = true;
          break;
      }
      if(!repsStatus) {
        let newStatus = await this.diagnostic.requestCameraRollAuthorization();
        if(newStatus == this.diagnostic.permissionStatus.GRANTED) {
          repsStatus = true;
        } else {
          repsStatus = false;
        }
      }
      return repsStatus;
     } catch (error) {
      return true;
     }
   }
   
}
