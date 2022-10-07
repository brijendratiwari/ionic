import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReferralsHistoryPage } from './referrals-history.page';

const routes: Routes = [
  {
    path: '',
    component: ReferralsHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferralsHistoryPage]
})
export class ReferralsHistoryPageModule {}
