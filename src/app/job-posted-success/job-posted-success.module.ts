import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobPostedSuccessPage } from './job-posted-success.page';

const routes: Routes = [
  {
    path: '',
    component: JobPostedSuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobPostedSuccessPage]
})
export class JobPostedSuccessPageModule {}
