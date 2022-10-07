import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PetSitterDetailPage} from './pet-sitter-detail.page';
import {CalendarModule} from 'ion2-calendar';
import { PolicyComponent } from '../policy/policy.component';
import { BadgeModelComponent } from '../badge-model/badge-model.component';
import { ReportListingComponent } from '../myListing/report-listing/report-listing.component';

const routes: Routes = [
    {
        path: '',
        component: PetSitterDetailPage
    }
];

@NgModule({
    entryComponents:[PolicyComponent,BadgeModelComponent,ReportListingComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CalendarModule,
        RouterModule.forChild(routes)
    ],
    declarations: [PetSitterDetailPage,PolicyComponent,BadgeModelComponent,ReportListingComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PetSitterDetailPageModule {
}
