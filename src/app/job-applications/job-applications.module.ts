import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobApplicationsPage } from './job-applications.page';

const routes: Routes = [
  {
    path: '',
    component: JobApplicationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobApplicationsPage],
  entryComponents:[JobApplicationsPage],
})
export class JobApplicationsPageModule {}
