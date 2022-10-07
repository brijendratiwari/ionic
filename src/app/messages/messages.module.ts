import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {MessagesPage} from './messages.page';


const routes: Routes = [   {
    path: '',
    component: MessagesPage,
    children: [
      {
        path: 'messages-list',
        loadChildren: () => import('../messages-list/messages-list.module').then(m => m.MessagesListPageModule)
        // loadChildren: '../messages-list/messages-list.module#MessagesListPageModule'
      
      },
      {
        path: 'job-application-tab',
        loadChildren: () => import('../job-application-tab/job-application-tab.module').then(m => m.JobApplicationTabPageModule)
        // loadChildren: '../job-application-tab/job-application-tab.module#JobApplicationTabPageModule'
      },{
        path: '',
        redirectTo: 'messages-list',
        pathMatch: 'full'
    }
    ]}];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [MessagesPage],
})
export class MessagesPageModule {
}

