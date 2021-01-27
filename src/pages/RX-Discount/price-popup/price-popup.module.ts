import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PricePopupPage } from './price-popup';

@NgModule({
  declarations: [
    PricePopupPage,
  ],
  imports: [
    IonicPageModule.forChild(PricePopupPage),
  ],
})
export class PricePopupPageModule {}
