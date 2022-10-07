import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import {SearchSitterMapPage} from './search-sitter-map.page';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
// import {MapFilterPage} from '../map-filter/map-filter.page';

const routes: Routes = [
    {
        path: '',
        component: SearchSitterMapPage
    }
];

@NgModule({
    // entryComponents: [MapFilterPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GooglePlaceModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SearchSitterMapPage,
        // MapFilterPage
    ],
    providers:[LocationAccuracy],
})
export class SearchSitterMapPageModule {
}
