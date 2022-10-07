import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CheckAvailabilityPage} from './check-availability.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { NonAvailabilityAdditionalBookingsComponent } from '../non-availability-additional-bookings/non-availability-additional-bookings.component';
const routes: Routes = [
    {
        path: '',
        component: CheckAvailabilityPage
    }
];

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [CheckAvailabilityPage,NonAvailabilityAdditionalBookingsComponent],
    entryComponents:[NonAvailabilityAdditionalBookingsComponent],
    providers:[DatePicker]
})
export class CheckAvailabilityPageModule {
}
