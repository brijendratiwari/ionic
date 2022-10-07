import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileMobileVerifyPage } from './profile-mobile-verify.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileMobileVerifyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileMobileVerifyPage]
})
export class ProfileMobileVerifyPageModule {}
