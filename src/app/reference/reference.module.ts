import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReferencePage } from './reference.page';
import { RequestReferenceFormComponent } from '../request-reference-form/request-reference-form.component';

const routes: Routes = [
  {
    path: '',
    component: ReferencePage
  }
];
@NgModule({
  entryComponents: [RequestReferenceFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferencePage,RequestReferenceFormComponent]
})
export class ReferencePageModule {}
