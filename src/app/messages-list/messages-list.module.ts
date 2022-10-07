import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MessagesListPage } from './messages-list.page';
import { ToDateObjPipe } from '../pipe/to-date-obj.pipe';

const routes: Routes = [
  {
    path: '',
    component: MessagesListPage
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
  declarations: [MessagesListPage],
  providers:[ToDateObjPipe],
})
export class MessagesListPageModule {}
