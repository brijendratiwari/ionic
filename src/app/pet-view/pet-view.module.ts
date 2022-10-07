import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {PetViewPage} from './pet-view.page';

const routes: Routes = [
    {
        path: '',
        component: PetViewPage
    }
];

@NgModule({
    entryComponents:[],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,

        RouterModule.forChild(routes)
    ],
    providers: [Clipboard],
    declarations: [PetViewPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PetViewPageModule {
}
