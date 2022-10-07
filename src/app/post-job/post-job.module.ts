import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {PostJobPage} from './post-job.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { CalendarModule } from 'ion2-calendar';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PetTaxiAgreementModelComponent } from '../pet-taxi-agreement-model/pet-taxi-agreement-model.component';
const routes: Routes = [
    {
        path: '',
        component: PostJobPage
    }
];

@NgModule({
    entryComponents: [PetTaxiAgreementModelComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CalendarModule,
        GooglePlaceModule,
        RouterModule.forChild(routes)
    ],
    declarations: [PostJobPage,PetTaxiAgreementModelComponent],
    providers:[DatePicker]
})
export class PostJobPageModule {
}
