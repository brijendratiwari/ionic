import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';

const routes: Routes = [{
    path: 'tabs',
    component: HomePage,
    children: [
        {
            path:'explore',
            loadChildren: () => import('src/app/explore/explore.module').then(m => m.ExplorePageModule)
        },
        {
            path: 'jobs-tab',
            // loadChildren: '../jobs-tab/jobs-tab.module#JobsTabPageModule'
            loadChildren: () => import('src/app/jobs-tab/jobs-tab.module').then(m => m.JobsTabPageModule)
        },
        {
            path: 'sitter-listing',
            // loadChildren:'../../app/sitter-listing/sitter-listing.module#SitterListingPageModule'
            loadChildren: () => import('src/app/sitter-listing/sitter-listing.module').then(m => m.SitterListingPageModule)
        },
        {
            path: 'messages',
            // loadChildren: '../messages/messages.module#MessagesPageModule'
            loadChildren: () => import('src/app/messages/messages.module').then(m => m.MessagesPageModule)
        },
        {
            path: 'messages-list',
            loadChildren: () => import('src/app/messages-list/messages-list.module').then(m => m.MessagesListPageModule)
        },{
            path: 'profile-menu',
            loadChildren: () => import('src/app/profile-menu/profile-menu.module').then(m => m.ProfileMenuPageModule)
        },

    ]
}, {
    path: '',
    redirectTo: 'tabs/explore',
    pathMatch: 'full'
}];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
