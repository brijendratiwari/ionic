import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { JobsComponent } from './jobs.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'

@NgModule({
    declarations:[JobsComponent],
    exports:[JobsComponent,],
    imports:[IonicModule,CommonModule],
})

export class JobsSharedComponent{

}