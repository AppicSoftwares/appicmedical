import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LowestPricePage } from './lowest-price';

@NgModule({
  declarations: [
    LowestPricePage,
  ],
  imports: [
    IonicPageModule.forChild(LowestPricePage),
  ],
})
export class LowestPricePageModule {}
