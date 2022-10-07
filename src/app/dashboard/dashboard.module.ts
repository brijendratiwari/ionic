import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GooglePlaceModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardPage],
  providers:[InAppBrowser]
})
export class DashboardPageModule {}
