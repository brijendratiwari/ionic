import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ViewJobsPage} from './view-jobs.page';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { JobsSharedComponent } from '../components/jobs/jobscomponent.modules';
import { PostJobSharedComponent } from '../components/post-job/post-job-shared.module';

const routes: Routes = [
    {
        path: '',
        component: ViewJobsPage
    }
];

@NgModule({
    entryComponents: [],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GooglePlaceModule,
        JobsSharedComponent,
        PostJobSharedComponent,
        RouterModule.forChild(routes)
    ],
    providers:[Clipboard,LocationAccuracy],
    declarations: [ViewJobsPage,],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ViewJobsPageModule {
}
