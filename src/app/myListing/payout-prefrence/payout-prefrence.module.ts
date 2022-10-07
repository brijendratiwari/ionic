import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PayoutPrefrencePage} from './payout-prefrence.page';

const routes: Routes = [
    {
        path: '',
        component: PayoutPrefrencePage
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
    declarations: [PayoutPrefrencePage]
})
export class PayoutPrefrencePageModule {
}
