import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ProfilePhotoUploadPage} from './profile-photo-upload.page';

// native plugins
import {Camera} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';

const routes: Routes = [
    {
        path: '',
        component: ProfilePhotoUploadPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        Camera,
        File,
        FileTransfer,
        WebView,
    ],
    declarations: [ProfilePhotoUploadPage]
})
export class ProfilePhotoUploadPageModule {
}
