import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ListingPhotosPage} from './listing-photos.page';
// native plugins
import {Camera} from '@ionic-native/camera/ngx';

const routes: Routes = [
    {
        path: '',
        component: ListingPhotosPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ], providers: [
        Camera,
      ],
    declarations: [ListingPhotosPage]
})
export class ListingPhotosPageModule {
}
