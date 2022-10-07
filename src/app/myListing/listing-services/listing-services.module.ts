import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ListingServicesPage} from './listing-services.page';

const routes: Routes = [
    {
        path: '',
        component: ListingServicesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListingServicesPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListingServicesPageModule {
}
