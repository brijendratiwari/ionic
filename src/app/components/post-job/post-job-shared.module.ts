import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'
import { PostJobComponent } from './post-job.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@NgModule({
    declarations:[PostJobComponent],
    exports:[PostJobComponent,],
    imports:[IonicModule,CommonModule,FormsModule,ReactiveFormsModule],
    providers:[DatePicker]
})

export class PostJobSharedComponent{

}