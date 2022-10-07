import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'
import { CategoryListComponent } from './category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations:[CategoryListComponent],
    exports:[CategoryListComponent,],
    imports:[IonicModule,CommonModule,FormsModule,ReactiveFormsModule]
})

export class CategoryListSharedComponent{

}