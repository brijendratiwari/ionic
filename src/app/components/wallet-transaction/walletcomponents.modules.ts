import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { WalletTransactionComponent } from './wallet-transaction.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'

@NgModule({
    declarations:[WalletTransactionComponent],
    exports:[WalletTransactionComponent,],
    imports:[IonicModule,CommonModule],
   
})

export class ComponentsModule{
}