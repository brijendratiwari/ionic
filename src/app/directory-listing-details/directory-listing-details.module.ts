import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DirectoryListingDetailsPage } from './directory-listing-details.page';
import { IonicRatingModule } from 'ionic4-rating';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { CustomMapPopupComponent } from '../custom-map-popup/custom-map-popup.component';

const routes: Routes = [
  {
    path: '',
    component: DirectoryListingDetailsPage
  }
];

@NgModule({
  entryComponents:[CustomMapPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[CallNumber,Clipboard],
  declarations: [DirectoryListingDetailsPage,CustomMapPopupComponent]
})
export class ListingCategoryDetailsPageModule {}
