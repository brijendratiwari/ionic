import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'
import { PostEnquiryComponent } from './post-enquiry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { CalendarModule } from 'ion2-calendar';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
    declarations:[PostEnquiryComponent],
    exports:[PostEnquiryComponent,],
    imports:[
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        GooglePlaceModule,
    ],
    providers:[DatePicker]
})

export class PostEnquirySharedComponent{

}