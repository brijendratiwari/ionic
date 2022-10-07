import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingAuthorizePage } from './booking-authorize.page';

const routes: Routes = [
  {
    path: '',
    component: BookingAuthorizePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingAuthorizePage]
})
export class BookingAuthorizePageModule {}
