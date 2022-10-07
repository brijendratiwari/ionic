import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FavouriteSitterPage } from './favourite-sitter.page';

const routes: Routes = [
  {
    path: '',
    component: FavouriteSitterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FavouriteSitterPage]
})
export class FavouriteSitterPageModule {}
