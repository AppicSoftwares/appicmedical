import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscountCardPage } from './discount-card';

@NgModule({
  declarations: [
    DiscountCardPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscountCardPage),
  ],
})
export class DiscountCardPageModule {}
