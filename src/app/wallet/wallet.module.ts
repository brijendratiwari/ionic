import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';
import { ComponentsModule } from '../components/wallet-transaction/walletcomponents.modules';


const routes: Routes = [
  {
    path: '',
    component: WalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletPage],
  exports:[]
})
export class WalletPageModule {

 
}
