import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { DirectoryListingMapPage } from './directory-listing-map.page';

const routes: Routes = [
  {
    path: '',
    component: DirectoryListingMapPage
  }
];

@NgModule({
  entryComponents:[],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GooglePlaceModule,
    RouterModule.forChild(routes)
  ],
  providers:[CallNumber,Clipboard, LocationAccuracy],
  declarations: [DirectoryListingMapPage],
})
export class DirectoryListingMapPageModule {}
