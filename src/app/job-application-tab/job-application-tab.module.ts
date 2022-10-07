import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobApplicationTabPage } from './job-application-tab.page';

const routes: Routes = [
  {
    path: '',
    component: JobApplicationTabPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobApplicationTabPage],
  exports:[JobApplicationTabPage]
})
export class JobApplicationTabPageModule {}
