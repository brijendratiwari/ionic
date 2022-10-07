import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PetAddPage} from './pet-add.page';
// native plugins
import {Camera} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

const routes: Routes = [
    {
        path: '',
        component: PetAddPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        Camera,
        File,
        WebView,
    ],
    declarations: [PetAddPage]
})
export class PetAddPageModule {
}
