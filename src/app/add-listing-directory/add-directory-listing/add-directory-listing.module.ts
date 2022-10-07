import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddDirectoryListingPage } from './add-directory-listing.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

const routes: Routes = [
  {
    path: '',
    component: AddDirectoryListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddDirectoryListingPage]
})
export class AddDirectoryListingPageModule {}
