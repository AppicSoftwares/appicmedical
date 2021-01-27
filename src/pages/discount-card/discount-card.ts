import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RxDiscountPage } from '../RX-Discount/rx-discount/rx-discount';


@IonicPage()
@Component({
  selector: 'page-discount-card',
  templateUrl: 'discount-card.html',
})
export class DiscountCardPage {

  constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams) {
  }

 discount(){
   this.navCtrl.push(RxDiscountPage)
 }
 ionViewWillLeave(){
  let backAction = this.androidplatform.registerBackButtonAction(() => {
    this.navCtrl.pop();
  });
}
}
