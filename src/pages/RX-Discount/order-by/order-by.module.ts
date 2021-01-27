import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderByPage } from './order-by';

@NgModule({
  declarations: [
    OrderByPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderByPage),
  ],
})
export class OrderByPageModule {}
