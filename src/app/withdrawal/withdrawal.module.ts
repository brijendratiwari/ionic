import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WithdrawalPage } from './withdrawal.page';
import { ComponentsModule } from '../components/wallet-transaction/walletcomponents.modules';
import { AddBankDetailPayoutComponent } from '../add-bank-detail-payout/add-bank-detail-payout.component';

const routes: Routes = [
  {
    path: '',
    component: WithdrawalPage
  }
];

@NgModule({
  entryComponents:[AddBankDetailPayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WithdrawalPage,AddBankDetailPayoutComponent],
  exports:[]
})
export class WithdrawalPageModule {}
