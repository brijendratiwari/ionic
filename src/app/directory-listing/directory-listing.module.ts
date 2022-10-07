import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectoryListingPage } from './directory-listing.page';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

const routes: Routes = [
  {
    path: '',
    component: DirectoryListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GooglePlaceModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DirectoryListingPage],
  providers:[LocationAccuracy],
})
export class DirectoryListingPageModule {}
