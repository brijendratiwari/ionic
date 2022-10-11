import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailabilitySettingsPageRoutingModule } from './availability-settings-routing.module';

import { AvailabilitySettingsPage } from './availability-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AvailabilitySettingsPageRoutingModule
  ],
  declarations: [AvailabilitySettingsPage]
})
export class AvailabilitySettingsPageModule { }
