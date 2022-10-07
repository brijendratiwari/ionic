import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckInternetConnectionPage } from './check-internet-connection.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInternetConnectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckInternetConnectionPage]
})
export class CheckInternetConnectionPageModule {}
