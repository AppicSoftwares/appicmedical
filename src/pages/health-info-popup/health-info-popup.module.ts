import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthInfoPopupPage } from './health-info-popup';

@NgModule({
  declarations: [
    HealthInfoPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthInfoPopupPage),
  ],
})
export class HealthInfoPopupPageModule {}
