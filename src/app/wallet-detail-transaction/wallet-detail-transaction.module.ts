import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WalletDetailTransactionPage } from './wallet-detail-transaction.page';
import { WalletSharedComponent } from '../components/transactionscard/walletcardshared.module';
import { ViewTransDetailComponent } from '../view-trans-detail/view-trans-detail.component';

const routes: Routes = [
  {
    path: '',
    component: WalletDetailTransactionPage
  }
];

@NgModule({
  entryComponents:[ViewTransDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    WalletSharedComponent,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletDetailTransactionPage,ViewTransDetailComponent]
})
export class WalletDetailTransactionPageModule {}
