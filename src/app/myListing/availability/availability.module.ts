import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {AvailabilityPage} from './availability.page';
// import {NgCalendarModule} from 'ionic2-calendar';
import {CalendarModule} from 'ion2-calendar';
import { SittergeneralavailabilityComponent } from '../../sittergeneralavailability/sittergeneralavailability.component';
import { MeetingdetailComponent } from '../../meetingdetail/meetingdetail.component';

const routes: Routes = [
    {
        path: '',
        component: AvailabilityPage
    }
];

@NgModule({
    entryComponents: [SittergeneralavailabilityComponent,MeetingdetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        CalendarModule
        // NgCalendarModule
    ],
    declarations: [AvailabilityPage,SittergeneralavailabilityComponent,MeetingdetailComponent]
})
export class AvailabilityPageModule {
}
