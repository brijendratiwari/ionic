import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecentJobListingPage } from './recent-job-listing.page';

const routes: Routes = [
  {
    path: '',
    component: RecentJobListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecentJobListingPage]
})
export class RecentJobListingPageModule {}
