import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PetUpdatePage} from './pet-update.page';

// native plugins
import {Camera} from '@ionic-native/camera/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import { AddVacinationComponent } from '../add-vacination/add-vacination.component';
import { VaccinationExplainationComponent } from '../vaccination-explaination/vaccination-explaination.component';

const routes: Routes = [
    {
        path: '',
        component: PetUpdatePage
    }
];

@NgModule({
    entryComponents:[AddVacinationComponent,VaccinationExplainationComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        Camera,
        WebView,
    ],
    declarations: [PetUpdatePage,AddVacinationComponent,VaccinationExplainationComponent]
})
export class PetUpdatePageModule {
}
