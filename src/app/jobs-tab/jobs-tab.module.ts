import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobsTabPage } from './jobs-tab.page';

const routes: Routes = [   {
  path: '',
  component: JobsTabPage,
  children: [
    {
      path: '',
      loadChildren: () =>  import('../post-job/post-job.module').then(m => m.PostJobPageModule)
      // loadChildren: '../post-job/post-job.module#PostJobPageModule',
    },
    {
      path: 'post-job',
      loadChildren: () =>  import('../post-job/post-job.module').then(m => m.PostJobPageModule)
      // loadChildren:  '../post-job/post-job.module#PostJobPageModule'
    },
    {
      path: 'view-jobs',
      loadChildren: () =>  import('..//view-jobs/view-jobs.module').then(m => m.ViewJobsPageModule)
      // loadChildren:  '../view-jobs/view-jobs.module#ViewJobsPageModule'
    },
    {
      path: 'jobs',
      loadChildren: () =>  import('../jobs/jobs.module').then(m => m.JobsPageModule)
      // loadChildren: '../jobs/jobs.module#JobsPageModule',  
  }
  ]}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobsTabPage]
})
export class JobsTabPageModule {}
