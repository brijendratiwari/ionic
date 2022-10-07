import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ProfileMenuPage} from './profile-menu.page';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { ShadowLoginComponent } from '../shadow-login/shadow-login.component';



const routes: Routes = [
    {
        path: '',
        component: ProfileMenuPage
    }
];

@NgModule({
    entryComponents:[ShadowLoginComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [InAppBrowser],
    declarations: [ProfileMenuPage,ShadowLoginComponent]
})
export class ProfileMenuPageModule {
}
