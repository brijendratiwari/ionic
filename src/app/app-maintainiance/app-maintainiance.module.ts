import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppMaintainiancePage } from './app-maintainiance.page';

const routes: Routes = [
  {
    path: '',
    component: AppMaintainiancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppMaintainiancePage]
})
export class AppMaintainiancePageModule {}
