import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GetStartedPage } from './get-started.page';
import { FastcoComponent } from '../fastco/fastco.component';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

const routes: Routes = [
  {
    path: '',
    component: GetStartedPage
  }
];

@NgModule({
  entryComponents: [FastcoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    Facebook,
    GooglePlus
  ],
  declarations: [FastcoComponent,GetStartedPage]
})
export class GetStartedPageModule { }
