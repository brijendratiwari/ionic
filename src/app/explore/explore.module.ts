import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ExplorePage} from './explore.page';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';
import { CategoryListSharedComponent } from '../components/category-list/category-list-shared.module';

const routes: Routes = [
    {
        path: '',
        component: ExplorePage
    }
];

@NgModule({
    entryComponents: [],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GooglePlaceModule,
        ReactiveFormsModule,
        IonBottomDrawerModule,
        RouterModule.forChild(routes),
        CategoryListSharedComponent
    ],
    providers:[LocationAccuracy,InAppBrowser],
    declarations: [
        ExplorePage,
        
    ]
})
export class ExplorePageModule {
}
