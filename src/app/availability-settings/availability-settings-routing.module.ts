import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailabilitySettingsPage } from './availability-settings.page';

const routes: Routes = [
  {
    path: '',
    component: AvailabilitySettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailabilitySettingsPageRoutingModule {}
