import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ProfileEmailVerifyPage} from './profile-email-verify.page';
import { Facebook } from '@ionic-native/facebook/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
// import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

const routes: Routes = [
    {
        path: '',
        component: ProfileEmailVerifyPage
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
    providers: [
        Facebook,
        InAppBrowser,
        SocialSharing
        // SmsRetriever
      ],
    declarations: [ProfileEmailVerifyPage]
})
export class ProfileEmailVerifyPageModule {
}
