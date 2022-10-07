import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { TransactionscardComponent } from './transactionscard.component';


@NgModule({
    declarations:[TransactionscardComponent],
    exports:[TransactionscardComponent],
    imports:[IonicModule]
})

export class WalletSharedComponent{

}