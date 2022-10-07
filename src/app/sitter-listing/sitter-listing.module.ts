import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SitterListingPage } from './sitter-listing.page';
import { PostJobPageModule } from '../post-job/post-job.module';
import { CalendarModule } from 'ion2-calendar';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { PostEnquirySharedComponent } from '../components/post-enquiry/post-enquiry-shared.module';

const routes: Routes = [
  {
    path: '',
    component: SitterListingPage
  }
];

@NgModule({
  imports: [
      CommonModule,
      GooglePlaceModule,
      FormsModule,
      IonicModule,
      RouterModule.forChild(routes),
      IonicRatingModule,
      CalendarModule,
      PostEnquirySharedComponent
  ],
  providers: [LocationAccuracy,InAppBrowser, DatePicker],
  declarations: [
      SitterListingPage
  ],

})
export class SitterListingPageModule {}
