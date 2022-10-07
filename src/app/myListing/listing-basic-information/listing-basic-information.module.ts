import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ListingBasicInformationPage} from './listing-basic-information.page';
import { PolicyDetailComponent } from './policy-detail/policy-detail.component';

const routes: Routes = [
    {
        path: '',
        component: ListingBasicInformationPage
    }
];

@NgModule({
    entryComponents: [PolicyDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListingBasicInformationPage,PolicyDetailComponent]
})
export class ListingBasicInformationPageModule {
}
