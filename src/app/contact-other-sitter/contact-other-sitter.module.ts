import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactOtherSitterPage } from './contact-other-sitter.page';

const routes: Routes = [
  {
    path: '',
    component: ContactOtherSitterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactOtherSitterPage]
})
export class ContactOtherSitterPageModule {}
