import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PaymentMethodPage} from './payment-method.page';
import {Stripe} from '@ionic-native/stripe/ngx';
// import {PayPal} from '@ionic-native/paypal/ngx';


const routes: Routes = [
    {
        path: '',
        component: PaymentMethodPage
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
    providers: [Stripe, 
        // PayPal
    ],
    declarations: [PaymentMethodPage]
})
export class PaymentMethodPageModule {
}
