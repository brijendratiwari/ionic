import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddmoneyPage } from './addmoney.page';
import { ComponentsModule } from '../components/wallet-transaction/walletcomponents.modules';
import { WalletSharedComponent } from '../components/transactionscard/walletcardshared.module';
// import { PayPal } from '@ionic-native/paypal/ngx';
import { ApplePay } from '@ionic-native/apple-pay/ngx';
import { AddCardDetailsComponent } from '../add-card-details/add-card-details.component';

const routes: Routes = [
  {
    path: '',
    component: AddmoneyPage
  }
];

@NgModule({
  entryComponents:[],
  imports: [
    CommonModule,
    ComponentsModule,
    WalletSharedComponent,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    // PayPal,
    ApplePay ],
  declarations: [AddmoneyPage]
})
export class AddmoneyPageModule {}
