import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NotificationPage} from './notification.page';
import {NotificationDetailComponent} from './notification-detail/notification-detail.component';

const routes: Routes = [
    {
        path: '',
        component: NotificationPage
    }
];

@NgModule({
    entryComponents: [NotificationDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [NotificationPage, NotificationDetailComponent]
})
export class NotificationPageModule {
}
