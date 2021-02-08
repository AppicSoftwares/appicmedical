import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { LowestPricePage } from '../RX-Discount/lowest-price/lowest-price';
import { DeliveredPage } from '../delivery/delivered/delivered';


@Component({
  selector: 'page-rx-delivery-popup',
  templateUrl: 'rx-delivery-popup.html',
})
export class RxDeliveryPopupPage {

  constructor( private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ok(){
    this.viewCtrl.dismiss();
  }
  lowPrice(){
    this.navCtrl.push(LowestPricePage)
  }
  deliverd() {
    this.navCtrl.push(DeliveredPage)
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
}
