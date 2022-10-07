import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {BasicInfoPage} from './basic-info.page';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
const routes: Routes = [
    {
        path: '',
        component: BasicInfoPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        GooglePlaceModule,
        RouterModule.forChild(routes),
        /*AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA6PHeobaARhtYsbr5Hu8WiXWWJb0kcelc',
            libraries: ['places']
        }),*/
    ],
    providers:[LocationAccuracy],
    declarations: [BasicInfoPage],
    schemas: [NO_ERRORS_SCHEMA]
})
export class BasicInfoPageModule {
}
